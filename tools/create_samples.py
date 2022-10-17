import requests
from random import randint, choices, sample
from datetime import datetime
import unicodedata

# pip install faker
from faker import Faker

num_poems_per_lines = 20
min_lines = 2
max_lines = 10
num_users = 50
max_user_len = 20

user_begin_id = 2

# Create some fake users with names from different locales
fake = Faker(['it_IT', 'en', 'ja_JP', 'de', 'ru_RU', 'fr_FR', 'ko_KR', 'sv_SE', 'es', 'da_DK', 'no_NO', 'fi_FI'])

names = [(user_begin_id + i, fake.unique.first_name().lower()) for i in range(num_users)]

assert(len(names) == len(set(names)))

# Make sure that the names generated to not exceed the maximum length limit
for i in range(len(names)):
    while len(names[i][1].encode('utf-8')) > max_user_len or ' ' in names[i][1]:
        names[i] = (names[i][0], fake.unique.first_name())


reg_start = datetime.fromisoformat('2022-08-01 00:00:00')
reg_end = datetime.fromisoformat('2022-10-01 23:59:59')

registration_dates = sorted([fake.date_time_between_dates(reg_start, reg_end) for _ in range(num_users)])

# Create the SQL statements for these.
insert_users = f"INSERT INTO User(userID, username, password, roleID, registrationDate) VALUES\n"
insert_users += ",\n".join([f"({id}, '{unicodedata.normalize('NFC', name)}', '$APP_ADMIN_HASH', 2, '{registration_dates[id - user_begin_id].strftime('%Y-%m-%d %H:%M:%S')}')" for id, name in names])
insert_users += ";"

#print(insert_users)

# Create a set of poems
poems = set()
for i in range(min_lines, max_lines + 1):
    resp = requests.get(f'https://poetrydb.org/poemcount,linecount/{num_poems_per_lines};{i}/lines')
    ret_poems = resp.json()

    [poems.add("\n".join(poem['lines'])) for poem in ret_poems]

# Filter out poems that are too long
max_poem_len = 256

for poem in poems.copy():
    if len(poem.encode('utf-8')) > max_poem_len:
        poems.remove(poem)

num_poems = len(poems)

# Assign the poems to users randomly
poem_dict = dict([(id, []) for id in range(user_begin_id, user_begin_id + num_users + 1)])

while len(poems) > 0:
    assigned_to = randint(user_begin_id, user_begin_id + num_users - 1)
    poem_dict[assigned_to].append(poems.pop())

post_end = datetime.now()

# Create the list which we will then convert to SQL statements.
poem_dates = []
for user_id, poem_list in poem_dict.items():
    for poem in poem_list:
        poem_dates.append((unicodedata.normalize('NFC', poem.replace("'", "''").replace("\n", "\\n")), user_id, fake.date_time_between_dates(registration_dates[user_id - user_begin_id], post_end)))

poem_dates = sorted(poem_dates, key=lambda x: x[2])

# Create the SQL statements for these.
# Beware that the strings are not properly escapes, besides the single quote character!
insert_poems = f"INSERT INTO PrivatePoem(poemID, poemText, userID, timestamp) VALUES\n"
insert_poems += ",\n".join([f"({poem_id+1}, '{poem_text}', {user_id}, '{date.strftime('%Y-%m-%d %H:%M:%S')}')" for poem_id, (poem_text, user_id, date) in enumerate(poem_dates)])
insert_poems += ";"

#print(insert_poems)

# Create a user_id to list of poem_ids dict for quick lookup.
poem_id_dict = dict([(id, list()) for id in range(user_begin_id, user_begin_id + num_users + 1)])
for poem_id, (poem_text, user_id, date) in enumerate(poem_dates):
    poem_id_dict[user_id].append(poem_id + 1)

# Create a poem_id to user_id dict for quick lookup.
poem_userid_dict = dict([(id, list()) for id in range(0, num_poems)])
for poem_id, (poem_text, user_id, date) in enumerate(poem_dates):
    poem_userid_dict[poem_id + 1] = user_id


# Create random favorites on other users poems
# We assume that 2/3 of all user favorite other posts.
num_fav_users = int( 2/3 * num_users)
# We assume that a user favorites between 1 and 20 other poems.
num_fav_min = 1
num_fav_max = 20
assert(num_poems >= num_fav_max)

favorite_choices = set()

for user_id in sample(range(user_begin_id, user_begin_id + num_users), num_fav_users):
    for _ in range(randint(num_fav_min, num_fav_max) + 1):
        while True:
            poem_id = randint(1, num_poems)
            choice = (poem_id, user_id)

            if poem_userid_dict[poem_id] == user_id or choice in favorite_choices:
                continue

            favorite_choices.add(choice)
            break

favorite_choices = sorted(list(favorite_choices), key=lambda x: (x[1], x[0]))

# Create the SQL statements for these.
# Beware that the strings are not properly escapes, besides the single quote character!
insert_favorites = f"INSERT INTO PrivatePoemFavorites(poemID, userID) VALUES\n"
insert_favorites += ",\n".join([f"({poem_id}, {user_id})" for poem_id, user_id in favorite_choices])
insert_favorites += ";"

# print(insert_favorites)

# Create random ratings for other poems
# We assume that 1/2 of all user rate other posts.
num_rat_users = int(1/2 * num_users)
# We assume that a user rates between 1 and 30 other poems.
num_rat_min = 1
num_rat_max = 30
assert(num_poems >= num_rat_max)

# This set is only used for the primary keys
rating_choices_pk = set()
# This list holds all values
rating_choices = []

for user_id in sample(range(user_begin_id, user_begin_id + num_users), num_rat_users):
    for _ in range(randint(num_rat_min, num_rat_max) + 1):
        while True:
            poem_id = randint(1, num_poems)
            choice = (poem_id, user_id)
            # Adjust the distribution to not get too many negative ratings
            rating = choices([-1, 1], weights=[30, 70], k=1)[0]

            if poem_userid_dict[poem_id] == user_id or choice in rating_choices_pk:
                continue

            rating_choices_pk.add(choice)
            rating_choices.append((poem_id, user_id, rating))
            break

rating_choices = sorted(list(rating_choices), key=lambda x: (x[1], x[0]))

# Create the SQL statements for these.
# Beware that the strings are not properly escapes, besides the single quote character!
insert_ratings = f"INSERT INTO PrivatePoemRating(poemID, userID, rating) VALUES\n"
insert_ratings += ",\n".join([f"({poem_id}, {user_id}, {rating})" for poem_id, user_id, rating in rating_choices])
insert_ratings += ";"

# print(insert_ratings)

# Create random reports for other poems
# We assume that 1/10 of all user reports other posts.
num_rep_users = int(1/10 * num_users)
# We assume that a user reports between 1 and 3 other poems.
num_rep_min = 1
num_rep_max = 3
assert(num_poems >= num_rep_max)
max_report_len = 256

# This set is only used for the primary keys
report_choices_pk = set()
# This list holds all values
report_choices = []

for user_id in sample(range(user_begin_id, user_begin_id + num_users), num_rep_users):
    for _ in range(randint(num_rep_min, num_rep_max) + 1):
        while True:
            poem_id = randint(1, num_poems)
            choice = (poem_id, user_id)
            # Adjust the distribution to not get too many negative ratings
            report_text = fake.text(max_nb_chars=max_report_len).replace("'", "''").replace("\n", "\\n")

            if poem_userid_dict[poem_id] == user_id or choice in report_choices_pk or len(report_text.encode('utf-8')) > max_report_len:
                continue

            report_choices_pk.add(choice)
            report_choices.append((poem_id, user_id, report_text))
            break

report_choices = sorted(list(report_choices), key=lambda x: (x[1], x[0], x[2]))

# Create the SQL statements for these.
# Beware that the strings are not properly escapes, besides the single quote character!
insert_reports = f"INSERT INTO PrivatePoemReports(poemID, userID, reportText) VALUES\n"
insert_reports += ",\n".join([f"({poem_id}, {user_id}, '{unicodedata.normalize('NFC', report_text)}')" for poem_id, user_id, report_text in report_choices])
insert_reports += ";"

# print(insert_reports)

# Generate follower
# We assume that 2/3 of all user follow other users.
num_fol_users = int(2/3 * num_users)
# We assume that a user follows between 1 and 7 other users.
num_fol_min = 1
num_fol_max = 7
assert(num_poems >= num_fol_max)

follow_choices = set()

for user_id in sample(range(user_begin_id, user_begin_id + num_users), num_fol_users):
    for _ in range(randint(num_fol_min, num_fol_max) + 1):
        while True:
            other_user_id = randint(user_begin_id, user_begin_id + num_users - 1)
            choice = (user_id, other_user_id)

            if user_id == other_user_id or choice in follow_choices:
                continue

            follow_choices.add(choice)
            break

follow_choices = sorted(list(follow_choices), key=lambda x: (x[0], x[1]))

# Create the SQL statements for these.
# Beware that the strings are not properly escapes, besides the single quote character!
insert_follows = f"INSERT INTO UserFollowing(userID, followedUserID) VALUES\n"
insert_follows += ",\n".join([f"({user_id}, {other_user_id})" for user_id, other_user_id in follow_choices])
insert_follows += ";"

# print(insert_follows)

# Construct the otherall .sql file
sql_content = f"USE PoeItDB;\n" \
              f"-- Setup some development/testing data\n" \
              f"\n" \
              f"-- Users\n" \
              f"{insert_users}\n" \
              f"\n" \
              f"-- Poems\n" \
              f"{insert_poems}\n" \
              f"\n" \
              f"-- Favorites\n" \
              f"{insert_favorites}\n" \
              f"\n" \
              f"-- Ratings\n" \
              f"{insert_ratings}\n" \
              f"\n" \
              f"-- Reports\n" \
              f"{insert_reports}\n" \
              f"\n" \
              f"-- Follower\n" \
              f"{insert_follows}\n"

# print(sql_content)

# Write content to disk
file_path = "../sql/04-testing-data.sql"

with open(file_path, 'w', encoding='utf-8') as file:
    file.write(sql_content)
USE PoeItDB;

-- Setup some development/testing data
-- # Users
INSERT INTO User(userID, username, password, roleID, registrationDate) VALUES
(2, 'peter', '$APP_ADMIN_HASH', 2, '2022-09-25 08:45:01'),
(3, 'chris', '$APP_ADMIN_HASH', 2, '2022-09-30 12:10:20'),
(4, 'mia', '$APP_ADMIN_HASH', 2, '2022-10-01 13:00:56'),
(5, 'julia', '$APP_ADMIN_HASH', 2, '2022-10-02 16:31:43'),
(6, 'beth', '$APP_ADMIN_HASH', 2, '2022-10-03 14:12:22');

-- # Poems
-- # Source: https://poemanalysis.com/best-poems/short-famous-classic/.
-- # Times generated with: sorted([f"2022-10-{randint(3, 14):02d} {randint(7, 23):02d}:{randint(0, 59):02d}:{randint(0, 59):02d}" for _ in range(20)])
INSERT INTO PrivatePoem(poemID, poemText, userID, timestamp) VALUES
(1, 'I wandered lonely as a cloud\nThat floats on high o’er vales and hills\nWhen all at once I saw a crowd\nA host, of golden daffodils', 2, '2022-10-03 17:25:36'),
(2, 'Shall I compare thee to a summer’s day?\nThou art more lovely and more temperate:\nRough winds do shake the darling buds of May,\nAnd summer’s lease hath all too short a date;', 4, '2022-10-03 17:26:47'),
(3, 'I think that I shall never see\nA poem lovely as a tree.', 6, '2022-10-04 18:38:46'),
(4, 'Do not go gentle into that good night,\nOld age should burn and rave at close of day;\nRage, rage against the dying of the light.', 5, '2022-10-04 20:24:02'),
(5, 'Two roads diverged in a yellow wood,\nAnd sorry I could not travel both', 3, '2022-10-06 07:57:55'),
(6, 'Death, be not proud, though some have called thee\nMighty and dreadful, for thou art not so', 2, '2022-10-07 13:16:02'),
(7, 'Give me your tired, your poor,\nYour huddled masses yearning to breathe free,\nThe wretched refuse of your teeming shore.', 5, '2022-10-07 19:35:35'),
(8, 'Who said—“Two vast and trunkless legs of stone\nStand in the desert…Near them, on the sand,\nHalf sunk a shattered visage lies, whose frown,\nAnd wrinkled lip, and sneer of cold command', 2, '2022-10-08 09:19:07'),
(9, 'Tell me not, in mournful numbers,\nLife is but an empty dream!\nFor the soul is dead that slumbers,\nAnd things are not what they seem', 6, '2022-10-08 13:08:15'),
(10, '’Twas brillig, and the slithy toves \nDid gyre and gimble in the wabe: \nAll mimsy were the borogoves, \nAnd the mome raths outgrabe.', 4, '2022-10-09 12:36:43'),
(11, 'Five years have past; five summers, with the length\nOf five long winters! and again I hear\nThese waters, rolling from their mountain-springs\nWith a soft inland murmur.—Once again\nDo I behold these steep and lofty cliffs', 5, '2022-10-10 19:48:34'),
(12, 'My mistress’ eyes are nothing like the sun\nCoral is far more red than her lips’ red\nIf snow be white, why then her breasts are dun;', 2, '2022-10-11 08:50:40'),
(13, 'Half a league, half a league,\nHalf a league onward,\nAll in the valley of Death\nRode the six hundred.', 6, '2022-10-11 13:56:33'),
(14, 'My heart aches, and a drowsy numbness pains\nMy sense, as though of hemlock I had drunk,\nOr emptied some dull opiate to the drains\nOne minute past, and Lethe-wards had sunk', 3, '2022-10-11 23:05:45'),
(15, 'I love thee to the depth and breadth and height\nMy soul can reach, when feeling out of sight\nFor the ends of being and ideal grace.', 2, '2022-10-12 10:44:36'),
(16, 'Tyger, Tyger, burning bright\nIn the forests of the night\nWhat immortal hand or eye\nCould frame thy fearful symmetry', 3, '2022-10-12 12:01:09'),
(17, 'Thou still unravish’d bride of quietness,\nThou foster-child of silence and slow time,\nSylvan historian, who canst thus express\nA flowery tale more sweetly than our rhyme:', 6, '2022-10-12 18:35:01'),
(18, 'Little Lamb who made thee\nDost thou know who made thee\nGave thee life & bid thee feed.\nBy the stream & o’er the mead;', 4, '2022-10-13 09:45:23'),
(19, 'It was many and many a year ago\nIn a kingdom by the sea\nThat a maiden there lived whom you may know\nby the name of Annabel Lee', 2, '2022-10-13 23:04:00'),
(20, 'O Captain! my Captain! our fearful trip is done;\nThe ship has weather’d every rack, the prize we sought is won;', 5, '2022-10-14 12:47:20');

-- # Favorites
-- # Favorites generated with: print(str(sorted(set([(randint(1, 20), i) for i in range (2, 7) for j in range(randint(3, 8))]), key=lambda x: (x[1], x[0]))).strip('[]').replace('), (', '),\n('))
-- # Requires: from random import randint
INSERT INTO PrivatePoemFavorites(poemID, userID) VALUES
(2, 2),
(3, 2),
(4, 2),
(8, 2),
(16, 2),
(18, 2),
(7, 3),
(10, 3),
(11, 3),
(14, 3),
(15, 3),
(19, 3),
(20, 3),
(2, 4),
(3, 4),
(5, 4),
(8, 4),
(13, 4),
(14, 4),
(1, 5),
(3, 5),
(10, 5),
(13, 5),
(14, 5),
(18, 5),
(1, 6),
(2, 6),
(6, 6),
(8, 6);

-- # Ratings
-- # Ratings generated with: print(str(sorted(set([(randint(1, 20), i, choice([-1, 1])) for i in range (2, 7) for j in range(randint(0, 6))]), key=lambda x: (x[1], x[0]))).strip('[]').replace('), (', '),\n('))
-- # Requires: from random import randint, choice
-- # Note: It could happen that this script generates multiple votes for one poem from the same user. Didn't want to handle that and filter it out by hand.
-- # Note: It could be that one of those poems already has a negative rating that will satisfy the delete requirement.
INSERT INTO PrivatePoemRating(poemID, userID, rating) VALUES
(16, 2, 1),
(17, 2, 1),
(19, 2, 1),
(8, 3, -1),
(9, 3, 1),
(11, 3, -1),
(12, 3, -1),
(13, 3, 1),
(14, 3, 1),
(13, 4, -1),
(19, 4, 1),
(8, 5, -1),
(16, 5, -1),
(2, 6, -1),
(4, 6, -1),
(12, 6, -1),
(14, 6, 1),
(17, 6, 1),
(19, 6, 1);

-- # Reports
-- # Reports generated with: print(str(sorted(set([(randint(1, 20), i, lorem.sentence()) for i in range (2, 7) for j in range(randint(0, 2))]), key=lambda x: (x[1], x[0]))).strip('[]').replace('), (', '),\n('))
-- # Requires: from random import randint; import lorem
-- # Note: It could happen that this script generates multiple reports for one poem from the same user. Didn't want to handle that and filter it out by hand.
INSERT INTO PrivatePoemReports(poemID, userID, reportText) VALUES
(19, 2, 'Amet magnam etincidunt dolore voluptatem dolore.'),
(9, 3, 'Ut voluptatem sed dolore est consectetur quaerat dolorem.'),
(14, 3, 'Dolore dolor modi labore.'),
(9, 5, 'Non voluptatem adipisci labore quiquia consectetur voluptatem dolor.'),
(20, 5, 'Sit porro dolorem tempora.'),
(9, 6, 'Etincidunt quaerat ipsum sit porro porro.');

-- # Follower
-- # Follower generated with: print(str(sorted(set([(i, randint(2, 6)) for i in range (2, 7) for j in range(randint(0, 4))]))).strip('[]').replace('), (', '),\n('))
-- # Requires: from random import randint
-- # Note: It could happen that a user follows himself in this script. Didn't want to handle it, filter it out by hand.
INSERT INTO UserFollowing(userID, followedUserID) VALUES
(2, 4),
(2, 6),
(3, 5),
(5, 4),
(5, 2),
(5, 6),
(6, 4);
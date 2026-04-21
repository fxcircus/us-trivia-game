// ============================================================
// SPEECHES — full texts for the Memorize mode.
//
// Shape:
//   id, title, author, year, context
//   lines: ordered array of strings. Memorize mode joins them with spaces
//     for word-level scoring, and renders them one per line for display.
//     Break at natural sentence or verse boundaries.
//
// To populate a speech: open the URL in the Source comment, copy the
// text, and add it to `lines` as one string per sentence, paragraph, or
// verse-line. Use backticks (`) so you don't have to escape apostrophes,
// quotes, or em-dashes.
//
// Speeches with an empty `lines` array are hidden from the Memorize tab.
// ============================================================

export const SPEECHES = [
  {
    id: 'gettysburg',
    title: 'Gettysburg Address',
    author: 'Abraham Lincoln',
    year: 1863,
    context: `Dedication of the Soldiers' National Cemetery at Gettysburg, Pennsylvania — November 19, 1863. 272 words.`,
    // Source: https://www.abrahamlincolnonline.org/lincoln/speeches/gettysburg.htm
    lines: [
      `Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.`,
      `Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battle-field of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this.`,
      `But, in a larger sense, we can not dedicate -- we can not consecrate -- we can not hallow -- this ground. The brave men, living and dead, who struggled here, have consecrated it, far above our poor power to add or detract. The world will little note, nor long remember what we say here, but it can never forget what they did here. It is for us the living, rather, to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced. It is rather for us to be here dedicated to the great task remaining before us -- that from these honored dead we take increased devotion to that cause for which they gave the last full measure of devotion -- that we here highly resolve that these dead shall not have died in vain -- that this nation, under God, shall have a new birth of freedom -- and that government of the people, by the people, for the people, shall not perish from the earth.`,
    ],
  },
  {
    id: 'jfk-inaugural',
    title: 'Inaugural Address',
    author: 'John F. Kennedy',
    year: 1961,
    context: `East Front of the U.S. Capitol — January 20, 1961. ~1,365 words.`,
    // Source: https://www.jfklibrary.org/learn/about-jfk/historic-speeches/inaugural-address
    lines: [
      `We observe today not a victory of party but a celebration of freedom--symbolizing an end as well as a beginning--signifying renewal as well as change. For I have sworn before you and Almighty God the same solemn oath our forbears prescribed nearly a century and three-quarters ago.`,
      `The world is very different now. For man holds in his mortal hands the power to abolish all forms of human poverty and all forms of human life. And yet the same revolutionary beliefs for which our forebears fought are still at issue around the globe--the belief that the rights of man come not from the generosity of the state but from the hand of God.`,
      `We dare not forget today that we are the heirs of that first revolution. Let the word go forth from this time and place, to friend and foe alike, that the torch has been passed to a new generation of Americans--born in this century, tempered by war, disciplined by a hard and bitter peace, proud of our ancient heritage--and unwilling to witness or permit the slow undoing of those human rights to which this nation has always been committed, and to which we are committed today at home and around the world.`,
      `Let every nation know, whether it wishes us well or ill, that we shall pay any price, bear any burden, meet any hardship, support any friend, oppose any foe to assure the survival and the success of liberty.`,
      `This much we pledge--and more.`,
      `To those old allies whose cultural and spiritual origins we share, we pledge the loyalty of faithful friends. United there is little we cannot do in a host of cooperative ventures. Divided there is little we can do--for we dare not meet a powerful challenge at odds and split asunder.`,
      `To those new states whom we welcome to the ranks of the free, we pledge our word that one form of colonial control shall not have passed away merely to be replaced by a far more iron tyranny. We shall not always expect to find them supporting our view. But we shall always hope to find them strongly supporting their own freedom--and to remember that, in the past, those who foolishly sought power by riding the back of the tiger ended up inside.`,
      `To those people in the huts and villages of half the globe struggling to break the bonds of mass misery, we pledge our best efforts to help them help themselves, for whatever period is required--not because the communists may be doing it, not because we seek their votes, but because it is right. If a free society cannot help the many who are poor, it cannot save the few who are rich.`,
      `To our sister republics south of our border, we offer a special pledge--to convert our good words into good deeds--in a new alliance for progress--to assist free men and free governments in casting off the chains of poverty. But this peaceful revolution of hope cannot become the prey of hostile powers. Let all our neighbors know that we shall join with them to oppose aggression or subversion anywhere in the Americas. And let every other power know that this Hemisphere intends to remain the master of its own house.`,
      `To that world assembly of sovereign states, the United Nations, our last best hope in an age where the instruments of war have far outpaced the instruments of peace, we renew our pledge of support--to prevent it from becoming merely a forum for invective--to strengthen its shield of the new and the weak--and to enlarge the area in which its writ may run.`,
      `Finally, to those nations who would make themselves our adversary, we offer not a pledge but a request: that both sides begin anew the quest for peace, before the dark powers of destruction unleashed by science engulf all humanity in planned or accidental self-destruction.`,
      `We dare not tempt them with weakness. For only when our arms are sufficient beyond doubt can we be certain beyond doubt that they will never be employed.`,
      `But neither can two great and powerful groups of nations take comfort from our present course--both sides overburdened by the cost of modern weapons, both rightly alarmed by the steady spread of the deadly atom, yet both racing to alter that uncertain balance of terror that stays the hand of mankind's final war.`,
      `So let us begin anew--remembering on both sides that civility is not a sign of weakness, and sincerity is always subject to proof. Let us never negotiate out of fear. But let us never fear to negotiate.`,
      `Let both sides explore what problems unite us instead of belaboring those problems which divide us.`,
      `Let both sides, for the first time, formulate serious and precise proposals for the inspection and control of arms--and bring the absolute power to destroy other nations under the absolute control of all nations.`,
      `Let both sides seek to invoke the wonders of science instead of its terrors. Together let us explore the stars, conquer the deserts, eradicate disease, tap the ocean depths and encourage the arts and commerce.`,
      `Let both sides unite to heed in all corners of the earth the command of Isaiah--to "undo the heavy burdens . . . (and) let the oppressed go free."`,
      `And if a beachhead of cooperation may push back the jungle of suspicion, let both sides join in creating a new endeavor, not a new balance of power, but a new world of law, where the strong are just and the weak secure and the peace preserved.`,
      `All this will not be finished in the first one hundred days. Nor will it be finished in the first one thousand days, nor in the life of this Administration, nor even perhaps in our lifetime on this planet. But let us begin.`,
      `In your hands, my fellow citizens, more than mine, will rest the final success or failure of our course. Since this country was founded, each generation of Americans has been summoned to give testimony to its national loyalty. The graves of young Americans who answered the call to service surround the globe.`,
      `Now the trumpet summons us again--not as a call to bear arms, though arms we need--not as a call to battle, though embattled we are-- but a call to bear the burden of a long twilight struggle, year in and year out, "rejoicing in hope, patient in tribulation"--a struggle against the common enemies of man: tyranny, poverty, disease and war itself.`,
      `Can we forge against these enemies a grand and global alliance, North and South, East and West, that can assure a more fruitful life for all mankind? Will you join in that historic effort?`,
      `In the long history of the world, only a few generations have been granted the role of defending freedom in its hour of maximum danger. I do not shrink from this responsibility--I welcome it. I do not believe that any of us would exchange places with any other people or any other generation. The energy, the faith, the devotion which we bring to this endeavor will light our country and all who serve it--and the glow from that fire can truly light the world.`,
      `And so, my fellow Americans: ask not what your country can do for you--ask what you can do for your country.`,
      `My fellow citizens of the world: ask not what America will do for you, but what together we can do for the freedom of man.`,
      `Finally, whether you are citizens of America or citizens of the world, ask of us here the same high standards of strength and sacrifice which we ask of you. With a good conscience our only sure reward, with history the final judge of our deeds, let us go forth to lead the land we love, asking His blessing and His help, but knowing that here on earth God's work must truly be our own.`,
    ],
  },
  {
    id: 'fdr-first-inaugural',
    title: 'First Inaugural Address',
    author: 'Franklin D. Roosevelt',
    year: 1933,
    context: `East Portico of the U.S. Capitol — March 4, 1933, at the depths of the Great Depression. Contains the "only thing we have to fear is fear itself" passage.`,
    // Source: https://millercenter.org/the-presidency/presidential-speeches/march-4-1933-first-inaugural-address
    lines: [
      `President Hoover, Mr. Chief Justice, my friends:`,
      `This is a day of national consecration. And I am certain that on this day my fellow Americans expect that on my induction into the Presidency I will address them with a candor and a decision which the present situation of our people impels. This is preeminently the time to speak the truth, the whole truth, frankly and boldly. Nor need we shrink from honestly facing conditions in our country today. This great Nation will endure as it has endured, will revive and will prosper. So, first of all, let me assert my firm belief that the only thing we have to fear is fear itself—nameless, unreasoning, unjustified terror which paralyzes needed efforts to convert retreat into advance. In every dark hour of our national life a leadership of frankness and vigor has met with that understanding and support of the people themselves which is essential to victory. I am convinced that you will again give that support to leadership in these critical days.`,
      `In such a spirit on my part and on yours we face our common difficulties. They concern, thank God, only material things. Values have shrunken to fantastic levels; taxes have risen; our ability to pay has fallen; government of all kinds is faced by serious curtailment of income; the means of exchange are frozen in the currents of trade; the withered leaves of industrial enterprise lie on every side; farmers find no markets for their produce; the savings of many years in thousands of families are gone.`,
      `More important, a host of unemployed citizens face the grim problem of existence, and an equally great number toil with little return. Only a foolish optimist can deny the dark realities of the moment.`,
      `Yet our distress comes from no failure of substance. We are stricken by no plague of locusts. Compared with the perils which our forefathers conquered because they believed and were not afraid, we have still much to be thankful for. Nature still offers her bounty and human efforts have multiplied it. Plenty is at our doorstep, but a generous use of it languishes in the very sight of the supply. Primarily this is because rulers of the exchange of mankind's goods have failed through their own stubbornness and their own incompetence, have admitted their failure, and have abdicated. Practices of the unscrupulous money changers stand indicted in the court of public opinion, rejected by the hearts and minds of men.`,
      `True they have tried, but their efforts have been cast in the pattern of an outworn tradition. Faced by failure of credit they have proposed only the lending of more money. Stripped of the lure of profit by which to induce our people to follow their false leadership, they have resorted to exhortations, pleading tearfully for restored confidence. They know only the rules of a generation of self-seekers. They have no vision, and when there is no vision the people perish.`,
      `The money changers have fled from their high seats in the temple of our civilization. We may now restore that temple to the ancient truths. The measure of the restoration lies in the extent to which we apply social values more noble than mere monetary profit.`,
      `Happiness lies not in the mere possession of money; it lies in the joy of achievement, in the thrill of creative effort. The joy and moral stimulation of work no longer must be forgotten in the mad chase of evanescent profits. These dark days will be worth all they cost us if they teach us that our true destiny is not to be ministered unto but to minister to ourselves and to our fellow men.`,
      `Recognition of the falsity of material wealth as the standard of success goes hand in hand with the abandonment of the false belief that public office and high political position are to be valued only by the standards of pride of place and personal profit; and there must be an end to a conduct in banking and in business which too often has given to a sacred trust the likeness of callous and selfish wrongdoing. Small wonder that confidence languishes, for it thrives only on honesty, on honor, on the sacredness of obligations, on faithful protection, on unselfish performance; without them it cannot live. Restoration calls, however, not for changes in ethics alone. This Nation asks for action, and action now.`,
      `Our greatest primary task is to put people to work. This is no unsolvable problem if we face it wisely and courageously. It can be accomplished in part by direct recruiting by the Government itself, treating the task as we would treat the emergency of a war, but at the same time, through this employment, accomplishing greatly needed projects to stimulate and reorganize the use of our natural resources.`,
      `Hand in hand with this we must frankly recognize the overbalance of population in our industrial centers and, by engaging on a national scale in a redistribution, endeavor to provide a better use of the land for those best fitted for the land. The task can be helped by definite efforts to raise the values of agricultural products and with this the power to purchase the output of our cities. It can be helped by preventing realistically the tragedy of the growing loss through foreclosure of our small homes and our farms. It can be helped by insistence that the Federal, State, and local governments act forthwith on the demand that their cost be drastically reduced. It can be helped by the unifying of relief activities which today are often scattered, uneconomical, and unequal. It can be helped by national planning for and supervision of all forms of transportation and of communications and other utilities which have a definitely public character. There are many ways in which it can be helped, but it can never be helped merely by talking about it. We must act and act quickly.`,
      `Finally, in our progress toward a resumption of work we require two safeguards against a return of the evils of the old order: there must be a strict supervision of all banking and credits and investments, so that there will be an end to speculation with other people's money; and there must be provision for an adequate but sound currency.`,
      `These are the lines of attack. I shall presently urge upon a new Congress, in special session, detailed measures for their fulfillment, and I shall seek the immediate assistance of the several States.`,
      `Through this program of action we address ourselves to putting our own national house in order and making income balance outgo. Our international trade relations, though vastly important, are in point of time and necessity secondary to the establishment of a sound national economy. I favor as a practical policy the putting of first things first. I shall spare no effort to restore world trade by international economic readjustment, but the emergency at home cannot wait on that accomplishment.`,
      `The basic thought that guides these specific means of national recovery is not narrowly nationalistic. It is the insistence, as a first considerations, upon the interdependence of the various elements in and parts of the United States-a recognition of the old and permanently important manifestation of the American spirit of the pioneer. It is the way to recovery. It is the immediate way. It is the strongest assurance that the recovery will endure.`,
      `In the field of world policy I would dedicate this Nation to the policy of the good neighbor—the neighbor who resolutely respects himself and, because he does so, respects the rights of others—the neighbor who respects his obligations and respects the sanctity of his agreements in and with a world of neighbors.`,
      `If I read the temper of our people correctly, we now realize as we have never realized before our interdependence on each other; that we cannot merely take but we must give as well; that if we are to go forward, we must move as a trained and loyal army willing to sacrifice for the good of a common discipline, because without such discipline no progress is made, no leadership becomes effective. We are, I know, ready and willing to submit our lives and property to such discipline, because it makes possible a leadership which aims at a larger good. This I propose to offer, pledging that the larger purposes will bind upon us all as a sacred obligation with a unity of duty hitherto evoked only in time of armed strife.`,
      `With this pledge taken, I assume unhesitatingly the leadership of this great army of our people dedicated to a disciplined attack upon our common problems.`,
      `Action in this image and to this end is feasible under the form of government which we have inherited from our ancestors. Our Constitution is so simple and practical that it is possible always to meet extraordinary needs by changes in emphasis and arrangement without loss of essential form. That is why our constitutional system has proved itself the most superbly enduring political mechanism the modern world has produced. It has met every stress of vast expansion of territory, of foreign wars, of bitter internal strife, of world relations.`,
      `It is to be hoped that the normal balance of Executive and legislative authority may be wholly adequate to meet the unprecedented task before us. But it may be that an unprecedented demand and need for undelayed action may call for temporary departure from that normal balance of public procedure.`,
      `I am prepared under my constitutional duty to recommend the measures that a stricken Nation in the midst of a stricken world may require. These measures, or such other measures as the Congress may build out of its experience and wisdom, I shall seek, within my constitutional authority, to bring to speedy adoption.`,
      `But in the event that the Congress shall fail to take one of these two courses, and in the event that the national emergency is still critical, I shall not evade the clear course of duty that will then confront me. I shall ask the Congress for the one remaining instrument to meet the crisis—broad Executive power to wage a war against the emergency, as great as the power that would be given to me if we were in fact invaded by a foreign foe.`,
      `For the trust reposed in me I will return the courage and the devotion that befit the time. I can do no less.`,
      `We face the arduous days that lie before us in the warm courage of national unity; with the clear consciousness of seeking old and precious moral values; with the clean satisfaction that comes from the stern performance of duty by old and young alike. We aim at the assurance of a rounded and permanent national life.`,
      `We do not distrust the future of essential democracy. The people of the United States have not failed. In their need they have registered a mandate that they want direct, vigorous action. They have asked for discipline and direction under leadership. They have made me the present instrument of their wishes. In the spirit of the gift I take it.`,
      `In this dedication of a Nation we humbly ask the blessing of God. May He protect each and every one of us. May He guide me in the days to come.`,
    ],
  },
  {
    id: 'fdr-infamy',
    title: 'Day of Infamy Address',
    author: 'Franklin D. Roosevelt',
    year: 1941,
    context: `Joint Session of Congress — December 8, 1941, requesting a declaration of war after the attack on Pearl Harbor. ~510 words.`,
    // Source: https://en.wikipedia.org/wiki/Infamy_Speech  (full text in the article body)
    lines: [],
  },
  {
    id: 'lincoln-second-inaugural',
    title: 'Second Inaugural Address',
    author: 'Abraham Lincoln',
    year: 1865,
    context: `East Portico of the U.S. Capitol — March 4, 1865, 41 days before his assassination. ~703 words. Closes with "With malice toward none, with charity for all..."`,
    // Source: https://millercenter.org/the-presidency/presidential-speeches/march-4-1865-second-inaugural-address
    lines: [
      `Fellow-Countrymen:`,
      `At this second appearing to take the oath of the Presidential office there is less occasion for an extended address than there was at the first. Then a statement somewhat in detail of a course to be pursued seemed fitting and proper. Now, at the expiration of four years, during which public declarations have been constantly called forth on every point and phase of the great contest which still absorbs the attention and engrosses the energies of the nation, little that is new could be presented. The progress of our arms, upon which all else chiefly depends, is as well known to the public as to myself, and it is, I trust, reasonably satisfactory and encouraging to all. With high hope for the future, no prediction in regard to it is ventured.`,
      `On the occasion corresponding to this four years ago all thoughts were anxiously directed to an impending civil war. All dreaded it, all sought to avert it. While the inaugural address was being delivered from this place, devoted altogether to saving the Union without war, insurgent agents were in the city seeking to destroy it without war-seeking to dissolve the Union and divide effects by negotiation. Both parties deprecated war, but one of them would make war rather than let the nation survive, and the other would accept war rather than let it perish, and the war came.`,
      `One-eighth of the whole population were colored slaves, not distributed generally over the Union. but localized in the southern part of it. These slaves constituted a peculiar and powerful interest. All knew that this interest was somehow the cause of the war. To strengthen, perpetuate, and extend this interest was the object for which the insurgents would rend the Union even by war, while the Government claimed no right to do more than to restrict the territorial enlargement of it. Neither party expected for the war the magnitude or the duration which it has already attained. Neither anticipated that the cause of the conflict might cease with or even before the conflict itself should cease. Each looked for an easier triumph, and a result less fundamental and astounding. Both read the same Bible and pray to the same God, and each invokes His aid against the other. It may seem strange that any men should dare to ask a just God's assistance in wringing their bread from the sweat of other men's faces, but let us judge not, that we be not judged. The prayers of both could not be answered. That of neither has been answered fully. The Almighty has His own purposes. "Woe unto the world because of offenses; for it must needs be that offenses come, but woe to that man by whom the offense cometh." If we shall suppose that American slavery is one of those offenses which, in the providence of God, must needs come, but which, having continued through His appointed time, He now wills to remove, and that He gives to both North and South this terrible war as the woe due to those by whom the offense came, shall we discern therein any departure from those divine attributes which the believers in a living God always ascribe to Him? Fondly do we hope, fervently do we pray, that this mighty scourge of war may speedily pass away. Yet, if God wills that it continue until all the wealth piled by the bondsman's two hundred and fifty years of unrequited toil shall be sunk, and until every drop of blood drawn with the lash shall be paid by another drawn with the sword, as was said three thousand years ago, so still it must be said "the judgments of the Lord are true and righteous altogether."`,
      `With malice toward none, with charity for all, with firmness in the right as God gives us to see the right, let us strive on to finish the work we are in, to bind up the nation's wounds, to care for him who shall have borne the battle and for his widow and his orphan, to do all which may achieve and cherish a just and lasting peace among ourselves and with all nations.`,
    ],
  },
  {
    id: 'mlk-dream',
    title: 'I Have a Dream (excerpt)',
    author: 'Martin Luther King Jr.',
    year: 1963,
    context: `March on Washington, steps of the Lincoln Memorial — August 28, 1963. This entry is the "I have a dream" refrain section, not the full 17-minute speech.`,
    // Source: https://kinginstitute.stanford.edu/i-have-dream-speech-delivered-march-washington
    //         Paste the passages beginning "I have a dream that one day..."
    //         up through "...little black boys and black girls as sisters and brothers."
    lines: [],
  },
  {
    id: 'pledge',
    title: 'Pledge of Allegiance',
    author: 'Francis Bellamy (revised 1954)',
    year: 1892,
    context: `Written by Bellamy in 1892 for the 400th anniversary of Columbus's landing. "Under God" was added by Act of Congress on June 14, 1954. 31 words.`,
    // Source: https://en.wikipedia.org/wiki/Pledge_of_Allegiance  (see "Current official version")
    lines: [
      `I pledge allegiance to the Flag of the United States of America, and to the Republic for which it stands, one nation under God, indivisible, with liberty and justice for all.`,
    ],
  },
  {
    id: 'constitutional-preamble',
    title: 'Preamble to the Constitution',
    author: 'Constitutional Convention',
    year: 1787,
    context: `Drafted at the Constitutional Convention in Philadelphia, 1787. A single 52-word sentence.`,
    // Source: https://www.archives.gov/founding-docs/constitution-transcript
    lines: [
      `We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defense, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America.`,
    ],
  },
  {
    id: 'declaration-preamble',
    title: 'Declaration of Independence — opening',
    author: 'Thomas Jefferson et al.',
    year: 1776,
    context: `The most-memorized opening of the Declaration: "When in the Course of human events..." through "We hold these truths..." and the consent-of-the-governed passage.`,
    // Source: https://www.archives.gov/founding-docs/declaration-transcript
    lines: [
      `The unanimous Declaration of the thirteen united States of America, When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation.`,
      `We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.--That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed, --That whenever any Form of Government becomes destructive of these ends, it is the Right of the People to alter or to abolish it, and to institute new Government, laying its foundation on such principles and organizing its powers in such form, as to them shall seem most likely to effect their Safety and Happiness. Prudence, indeed, will dictate that Governments long established should not be changed for light and transient causes; and accordingly all experience hath shewn, that mankind are more disposed to suffer, while evils are sufferable, than to right themselves by abolishing the forms to which they are accustomed. But when a long train of abuses and usurpations, pursuing invariably the same Object evinces a design to reduce them under absolute Despotism, it is their right, it is their duty, to throw off such Government, and to provide new Guards for their future security.--Such has been the patient sufferance of these Colonies; and such is now the necessity which constrains them to alter their former Systems of Government. The history of the present King of Great Britain is a history of repeated injuries and usurpations, all having in direct object the establishment of an absolute Tyranny over these States. To prove this, let Facts be submitted to a candid world.`,
    ],
  },
  {
    id: 'anthem-v1',
    title: 'The Star-Spangled Banner — Verse 1',
    author: 'Francis Scott Key',
    year: 1814,
    context: `Written September 14, 1814, after witnessing the defense of Fort McHenry. Verse 1 is the one commonly sung.`,
    // Source: https://en.wikisource.org/wiki/The_Star-Spangled_Banner  (stanza 1)
    lines: [
      `O say can you see, by the dawn's early light,`,
      `What so proudly we hail'd at the twilight's last gleaming,`,
      `Whose broad stripes and bright stars through the perilous fight`,
      `O'er the ramparts we watch'd were so gallantly streaming?`,
      `And the rocket's red glare, the bomb bursting in air,`,
      `Gave proof through the night that our flag was still there,`,
      `O say does that star-spangled banner yet wave`,
      `O'er the land of the free and the home of the brave?`,
    ],
  },
  {
    id: 'anthem-v4',
    title: 'The Star-Spangled Banner — Verse 4',
    author: 'Francis Scott Key',
    year: 1814,
    context: `Closing verse. Its line "And this be our motto: 'In God is our trust'" helped seed the official national motto more than a century later (adopted 1956).`,
    // Source: https://en.wikisource.org/wiki/The_Star-Spangled_Banner  (stanza 4)
    lines: [
      `O thus be it ever when freemen shall stand`,
      `Between their lov'd home and the war's desolation!`,
      `Blest with vict'ry and peace may the heav'n rescued land`,
      `Praise the power that hath made and preserv'd us a nation!`,
      `Then conquer we must, when our cause it is just,`,
      `And this be our motto - "In God is our trust,"`,
      `And the star-spangled banner in triumph shall wave`,
      `O'er the land of the free and the home of the brave.`,
    ],
  },
];

import"../chunks/DsnmJJEf.js";import"../chunks/69_IOA4Y.js";import{aA as Y,h as ke,a as Pe,J as Re,aQ as $e,k as Se,C as Be,B as Le,aI as ze,aH as qe,ac as _e,s as Ne,ab as je,l as se,ad as Ee,w as Ue,aR as Qe,aS as Ve,R as Ge,aT as Ke,aU as Je,S as k,T as v,V as Xe,aq as T,m as e,t as ce,W as c,X as n,Y as a,a3 as o,az as Ae,aV as De,aC as Ze}from"../chunks/CwIXl9NE.js";import{s as A,e as N}from"../chunks/XqYqyXl2.js";import{i as Z}from"../chunks/C1VzLvfn.js";import{e as $,i as j}from"../chunks/Da8oe64x.js";import{s as he}from"../chunks/qkL-XxoW.js";import{i as eo}from"../chunks/VA2OuYhv.js";import{b as P}from"../chunks/wE8Y88Zi.js";function ge(h,S,M=!1,D=!1,d=!1){var w=h,i="";Y(()=>{var H=Re;if(i===(i=S()??"")){ke&&Pe();return}if(H.nodes_start!==null&&($e(H.nodes_start,H.nodes_end),H.nodes_start=H.nodes_end=null),i!==""){if(ke){Se.data;for(var C=Pe(),ee=C;C!==null&&(C.nodeType!==Be||C.data!=="");)ee=C,C=Le(C);if(C===null)throw ze(),qe;_e(Se,ee),w=Ne(C);return}var B=i+"";M?B=`<svg>${B}</svg>`:D&&(B=`<math>${B}</math>`);var O=je(B);if((M||D)&&(O=se(O)),_e(se(O),O.lastChild),M||D)for(;se(O);)w.before(se(O));else w.before(O)}})}function fe(h,S,M=!1){if(h.multiple){if(S==null)return;if(!Ue(S))return Qe();for(var D of h.options)D.selected=S.includes(We(D));return}for(D of h.options){var d=We(D);if(Ve(d,S)){D.selected=!0;return}}(!M||S!==void 0)&&(h.selectedIndex=-1)}function Ce(h){var S=new MutationObserver(()=>{fe(h,h.__value)});S.observe(h,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),Ee(()=>{S.disconnect()})}function We(h){return"__value"in h?h.__value:h.value}const oo={name:"Skill Proficiencies",description:`
		Armor: Light armor, medium armor, shields <br>
		Weapons: Simple weapons, martial weapons <br>
		Saving Throws: Strength, Constitution <br>
		Skills: Choose two from Animal Handling, Athletics, Intimidation, Nature, Perception, and Survival
	`,featureOptions:{placeholderText:"",options:["Animal Handling","Athletics","Intimidation","Nature","Perception","Survival"],numPicks:2},source:"barbarian.proficiencies"},ao={name:"Primal Path",description:"Choose a path that shapes the nature of your rage.",featureOptions:{placeholderText:"-Choose an Option-",options:[{name:"Berserker",optionDescription:" 					For some barbarians, rage is a means to an end — that end being violence. 					The Path of the Berserker is a path of untrammeled fury, slick with blood. 					As you enter the berserker’s rage, you thrill in the chaos of battle, heedless of your own health or well-being. 				",nestedPrompts:[{name:"Frenzy",description:" 							Starting when you choose this path at 3rd level, you can go into a frenzy when you rage. 							If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. 							When your rage ends, you suffer one level of exhaustion. 						",source:"barbarian.berserker"}]},{name:"Totem Warrior",optionDescription:" 					The Path of the Totem Warrior is a spiritual journey, as the barbarian accepts a spirit animal as guide, protector, and inspiration. 					In battle, your totem spirit fills you with supernatural might, adding magical fuel to your barbarian rage. 				",nestedPrompts:[{name:"Spirit Seeker",description:" 							Yours is a path that seeks attunement with the natural world, giving you a kinship with beasts. 							You gain the ability to cast the beast sense and speak with animals spells, 							but only as rituals, as described in the Spellcasting section. 						",source:"barbarian.totem_warrior"},{name:"Totem Spirit",description:" 							Choose a totem spirit and gain its feature. 							At 3rd level when you adopt this path, you gain the ability to cast the beast sense and speak with animals spells, 							but only as rituals, as described in the Spellcasting section. 						",source:"barbarian.totem_warrior"}]}],numPicks:1},source:"barbarian"},io=[{name:"Rage",description:"In battle, you fight with primal ferocity. You can enter a rage as a bonus action...",source:"barbarian"},{name:"Unarmored Defense",description:"While not wearing armor, your AC equals 10 + Dex modifier + Con modifier.",source:"barbarian"},{name:"Reckless Attack",description:"You can throw aside all concern for defense to attack with fierce desperation.",source:"barbarian"},{name:"Danger Sense",description:"You have advantage on Dexterity saving throws against effects you can see.",source:"barbarian"}],to={name:"Barbarian",image:P+"/class_icons/barbarian.jpg",description:"Frenzied warriors fueled by primal rage.",hitDie:"d12",primaryAbility:"Strength",saves:["Strength","Constitution"],armorProficiencies:["Light Armor","Medium Armor","Shields"],weaponProficiencies:["Simple Weapons","Martial Weapons"],classFeatures:[oo,...io,ao]},no={name:"Skill Proficiencies",description:`
		Armor: Light armor <br>
		Weapons: Simple weapons, hand crossbows, longswords, rapiers, shortswords <br>
		Saving Throws: Dexterity, Charisma <br>
		Skills: Choose any three
	`,featureOptions:{placeholderText:"Select skills",options:["Acrobatics","Animal Handling","Arcana","Athletics","Deception","History","Insight","Intimidation","Investigation","Medicine","Nature","Perception","Performance","Persuasion","Religion","Sleight of Hand","Stealth","Survival"],numPicks:3},source:"bard.proficiencies"},ro={name:"Bardic Inspiration",description:`
		You can inspire others through stirring words or music. 
		Use a bonus action to give one creature other than yourself within 60 feet an inspiration die (a d6). 
		This die can be added to ability checks, attack rolls, or saving throws.
		You can use this feature a number of times equal to your Charisma modifier (minimum of once), and regain all uses on a long rest.
	`,source:"bard"},so={name:"Spellcasting",description:`
		You know two cantrips of your choice from the bard spell list. 
		You know four 1st-level spells of your choice.
		You can cast spells using Charisma as your spellcasting ability.
	`,source:"bard"},co={name:"Jack of All Trades",description:`
		Starting at 2nd level, you can add half your proficiency bonus, rounded down, to any ability check you make that doesn’t already include your proficiency bonus.
	`,source:"bard"},lo={name:"Song of Rest",description:`
		Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest. 
		If you or any friendly creatures who can hear your performance regain hit points by spending Hit Dice at the end of the short rest, each of those creatures regains an extra 1d6 hit points.
	`,source:"bard"},po={name:"Bard College",description:"Choose a Bard College at 3rd level.",featureOptions:{placeholderText:"-Choose a College-",options:[{name:"College of Lore",optionDescription:`
					You learn additional magical secrets and gain Cutting Words to hinder foes.
				`,nestedPrompts:[{name:"Bonus Proficiencies",description:"You gain proficiency with three skills of your choice.",featureOptions:{placeholderText:"Select three skills",options:["Acrobatics","Animal Handling","Arcana","Athletics","Deception","History","Insight","Intimidation","Investigation","Medicine","Nature","Perception","Performance","Persuasion","Religion","Sleight of Hand","Stealth","Survival"],numPicks:3},source:"bard.college_of_lore"},{name:"Cutting Words",description:`
							When a creature you can see within 60 feet makes an attack roll, ability check, or damage roll, 
							you can use your reaction to expend one use of Bardic Inspiration, subtracting the roll from the creature’s roll.
						`,source:"bard.college_of_lore"}]},{name:"College of Valor",optionDescription:`
					You gain proficiency with medium armor, shields, and martial weapons. 
					You can inspire others to fight with valor.
				`,nestedPrompts:[{name:"Bonus Proficiencies",description:"You gain proficiency with medium armor, shields, and martial weapons.",source:"bard.college_of_valor"},{name:"Combat Inspiration",description:`
							Your Bardic Inspiration can be used to add to damage rolls or AC as well as ability checks, attack rolls, and saving throws.
						`,source:"bard.college_of_valor"}]}],numPicks:1},source:"bard"},uo=[ro,so,co,lo],mo={name:"Bard",image:P+"/class_icons/bard.jpg",description:"Inspiring leaders who weave magic through words and music.",hitDie:"d8",primaryAbility:"Charisma",saves:["Dexterity","Charisma"],armorProficiencies:["Light Armor"],weaponProficiencies:["Simple Weapons","Hand Crossbows","Longswords","Rapiers","Shortswords"],classFeatures:[no,...uo,po]},ho={name:"Skill Proficiencies",description:`
		Armor: Light armor, medium armor, shields <br>
		Weapons: Simple weapons <br>
		Saving Throws: Wisdom, Charisma <br>
		Skills: Choose two from History, Insight, Medicine, Persuasion, Religion
	`,featureOptions:{placeholderText:"Select two skills",options:["History","Insight","Medicine","Persuasion","Religion"],numPicks:2},source:"cleric.proficiencies"},go={name:"Spellcasting",description:`
		You can prepare and cast spells using Wisdom as your spellcasting ability. 
		You know three cantrips and have prepared a number of spells equal to your Wisdom modifier + cleric level.
	`,source:"cleric"},fo={name:"Channel Divinity",description:`
		Starting at 2nd level, you can use Channel Divinity to fuel magical effects. 
		You have one use per short or long rest.
	`,source:"cleric"},yo={name:"Divine Domain",description:"Choose a Divine Domain at 1st level. Your choice grants domain features at 1st and 2nd level.",featureOptions:{placeholderText:"-Choose a Domain-",options:[{name:"Life Domain",optionDescription:`
					The Life Domain emphasizes healing and protection.
				`,nestedPrompts:[{name:"Bonus Proficiencies",description:"You gain proficiency with heavy armor.",source:"cleric.life_domain"},{name:"Disciple of Life",description:`
							Your healing spells are more effective, adding extra hit points.
						`,source:"cleric.life_domain"}]},{name:"Light Domain",optionDescription:`
					The Light Domain harnesses the power of fire and radiance.
				`,nestedPrompts:[{name:"Bonus Cantrip",description:"You learn the Light cantrip.",source:"cleric.light_domain"},{name:"Warding Flare",description:`
							You can impose disadvantage on an attacker as a reaction.
						`,source:"cleric.light_domain"}]},{name:"Trickery Domain",optionDescription:`
					The Trickery Domain focuses on deception and stealth.
				`,nestedPrompts:[{name:"Bonus Proficiencies",description:"You gain proficiency with the Stealth skill.",source:"cleric.trickery_domain"},{name:"Blessing of the Trickster",description:`
							You can grant advantage on Stealth checks to an ally.
						`,source:"cleric.trickery_domain"}]}],numPicks:1},source:"cleric"},vo=[go,fo],wo={name:"Cleric",image:P+"/class_icons/cleric.jpg",description:"Holy warriors who wield divine magic to heal, protect, and smite foes.",hitDie:"d8",primaryAbility:"Wisdom",saves:["Wisdom","Charisma"],armorProficiencies:["Light Armor","Medium Armor","Shields"],weaponProficiencies:["Simple Weapons"],classFeatures:[ho,...vo,yo]},bo={name:"Skill Proficiencies",description:`
		Armor: Light armor, medium armor (non-metal), shields (non-metal) <br>
		Weapons: Clubs, daggers, darts, javelins, maces, quarterstaffs, scimitars, slings, spears <br>
		Saving Throws: Intelligence, Wisdom <br>
		Skills: Choose two from Arcana, Animal Handling, Insight, Medicine, Nature, Perception, Religion, Survival
	`,featureOptions:{placeholderText:"Select two skills",options:["Arcana","Animal Handling","Insight","Medicine","Nature","Perception","Religion","Survival"],numPicks:2},source:"druid.proficiencies"},ko={name:"Spellcasting",description:`
		You can prepare and cast spells using Wisdom as your spellcasting ability. 
		You know two cantrips and prepare a number of spells equal to your Wisdom modifier + druid level.
	`,source:"druid"},Po={name:"Wild Shape",description:`
		Starting at 2nd level, you can use your action to magically assume the shape of a beast you have seen before.
		You can use this feature twice per short or long rest.
	`,source:"druid"},So={name:"Druid Circle",description:"Choose a Druid Circle at 2nd level.",featureOptions:{placeholderText:"-Choose a Circle-",options:[{name:"Circle of the Land",optionDescription:`
					Your magic draws on the energy of the land, granting you additional spells.
				`,nestedPrompts:[{name:"Bonus Cantrip",description:"You learn one additional druid cantrip.",source:"druid.circle_of_the_land"},{name:"Natural Recovery",description:`
							You can regain some expended spell slots during a short rest.
						`,source:"druid.circle_of_the_land"}]},{name:"Circle of the Moon",optionDescription:`
					You are a fierce shapeshifter, able to transform into more powerful beasts.
				`,nestedPrompts:[{name:"Combat Wild Shape",description:`
							You can use Wild Shape as a bonus action and transform into stronger creatures.
						`,source:"druid.circle_of_the_moon"},{name:"Circle Forms",description:`
							You can transform into beasts with a higher challenge rating than normal.
						`,source:"druid.circle_of_the_moon"}]}],numPicks:1},source:"druid"},_o=[ko,Po],Ao={name:"Druid",image:P+"/class_icons/druid.jpg",description:"Masters of nature magic and shapeshifting, drawing power from the natural world.",hitDie:"d8",primaryAbility:"Wisdom",saves:["Intelligence","Wisdom"],armorProficiencies:["Light Armor","Medium Armor","Shields"],weaponProficiencies:["Clubs","Daggers","Darts","Javelins","Maces","Quarterstaffs","Scimitars","Slings","Spears"],classFeatures:[bo,..._o,So]},Do={name:"Skill Proficiencies",description:`
		Armor: All armor, shields <br>
		Weapons: Simple weapons, martial weapons <br>
		Saving Throws: Strength, Constitution <br>
		Skills: Choose two from Acrobatics, Animal Handling, Athletics, History, Insight, Intimidation, Perception, Survival
	`,featureOptions:{placeholderText:"Select two skills",options:["Acrobatics","Animal Handling","Athletics","History","Insight","Intimidation","Perception","Survival"],numPicks:2},source:"fighter.proficiencies"},Co={name:"Fighting Style",description:"Choose a fighting style that suits your combat approach.",featureOptions:{placeholderText:"-Choose a Fighting Style-",options:[{name:"Archery",optionDescription:"You gain a +2 bonus to attack rolls you make with ranged weapons."},{name:"Defense",optionDescription:"While you are wearing armor, you gain a +1 bonus to AC."},{name:"Dueling",optionDescription:"When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls."},{name:"Great Weapon Fighting",optionDescription:"When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon you are wielding with two hands, you can reroll the die."},{name:"Protection",optionDescription:"When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll."},{name:"Two-Weapon Fighting",optionDescription:"When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack."}],numPicks:1},source:"fighter"},Wo={name:"Second Wind",description:`
		You have a limited well of stamina that you can draw on to protect yourself from harm. 
		On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. 
		Once you use this feature, you must finish a short or long rest before you can use it again.
	`,source:"fighter"},Yo={name:"Action Surge",description:`
		Starting at 2nd level, you can push yourself beyond your normal limits for a moment. 
		On your turn, you can take one additional action on top of your regular action and a possible bonus action. 
		Once you use this feature, you must finish a short or long rest before you can use it again.
	`,source:"fighter"},To={name:"Martial Archetype",description:"Choose a Martial Archetype at 3rd level.",featureOptions:{placeholderText:"-Choose an Archetype-",options:[{name:"Champion",optionDescription:`
					Focused on raw physical power and improving critical hits.
				`,nestedPrompts:[{name:"Improved Critical",description:"Your weapon attacks score a critical hit on a roll of 19 or 20.",source:"fighter.champion"}]},{name:"Battle Master",optionDescription:`
					A master of martial techniques, using maneuvers to control the battlefield.
				`,nestedPrompts:[{name:"Combat Superiority",description:`
							You gain a set of maneuvers and superiority dice to enhance your attacks.
						`,source:"fighter.battle_master"}]},{name:"Eldritch Knight",optionDescription:`
					You learn to cast spells and blend magic with combat.
				`,nestedPrompts:[{name:"Weapon Bond",description:`
							You can bond with weapons to summon them to your hand.
						`,source:"fighter.eldritch_knight"},{name:"Spellcasting",description:`
							You learn a limited number of wizard spells.
						`,source:"fighter.eldritch_knight"}]}],numPicks:1},source:"fighter"},Oo=[Co,Wo,Yo],xo={name:"Fighter",image:P+"/class_icons/fighter.jpg",description:"Versatile warriors skilled in all forms of combat.",hitDie:"d10",primaryAbility:"Strength or Dexterity",saves:["Strength","Constitution"],armorProficiencies:["All Armor","Shields"],weaponProficiencies:["Simple Weapons","Martial Weapons"],classFeatures:[Do,...Oo,To]},Io={name:"Skill Proficiencies",description:`
		Armor: None <br>
		Weapons: Simple weapons, shortswords <br>
		Saving Throws: Strength, Dexterity <br>
		Skills: Choose two from Acrobatics, Athletics, History, Insight, Religion, and Stealth
	`,featureOptions:{placeholderText:"Select skills",options:["Acrobatics","Athletics","History","Insight","Religion","Stealth"],numPicks:2},source:"monk.proficiencies"},Mo={name:"Martial Arts",description:`
		At 1st level, your practice of martial arts gives you the ability to use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and monk weapons.
		You can roll a d4 in place of the normal damage of your unarmed strike or monk weapon. This die increases as you level.
		When you use the Attack action with an unarmed strike or monk weapon on your turn, you can make one unarmed strike as a bonus action.
	`,source:"monk"},Ho={name:"Ki",description:`
		Starting at 2nd level, you can use your ki to fuel special martial arts techniques.
		You have a number of ki points equal to your monk level, which you can spend to use features like Flurry of Blows, Patient Defense, and Step of the Wind.
		Ki points are regained after a short or long rest.
	`,source:"monk"},Fo={name:"Unarmored Movement",description:`
		Starting at 2nd level, your speed increases by 10 feet while you are not wearing armor or wielding a shield.
	`,source:"monk"},Ro={name:"Monastic Tradition",description:"Choose a monastic tradition (subclass) at 3rd level.",featureOptions:{placeholderText:"-Choose a Tradition-",options:[{name:"Way of the Open Hand",optionDescription:`
					This tradition emphasizes martial arts mastery, allowing you to manipulate your opponent's ki.
				`,nestedPrompts:[{name:"Open Hand Technique",description:`
							When you hit a creature with one of the attacks granted by your Flurry of Blows, you can impose one of the following effects:
							- It must succeed on a Dexterity saving throw or be knocked prone.
							- It must make a Strength saving throw or be pushed 15 feet away.
							- It can’t take reactions until the end of your next turn.
						`,source:"monk.open_hand"}]},{name:"Way of Shadow",optionDescription:`
					This tradition teaches you to use shadows and stealth to confound your enemies.
				`,nestedPrompts:[{name:"Shadow Arts",description:`
							You can use your ki to cast certain spells like darkness, darkvision, pass without trace, and silence.
						`,source:"monk.shadow"}]},{name:"Way of the Four Elements",optionDescription:`
					You harness the elemental forces to perform martial arts techniques.
				`,nestedPrompts:[{name:"Disciple of the Elements",description:`
							You can spend ki points to cast elemental disciplines.
						`,source:"monk.four_elements"}]}],numPicks:1},source:"monk"},$o=[Mo,Ho,Fo],Bo={name:"Monk",image:P+"/class_icons/monk.jpg",description:"Masters of martial arts harnessing the power of ki.",hitDie:"d8",primaryAbility:"Dexterity & Wisdom",saves:["Strength","Dexterity"],armorProficiencies:[],weaponProficiencies:["Simple Weapons","Shortswords"],classFeatures:[Io,...$o,Ro]},Lo={name:"Skill Proficiencies",description:`
		Armor: All armor, shields <br>
		Weapons: Simple weapons, martial weapons <br>
		Saving Throws: Wisdom, Charisma <br>
		Skills: Choose two from Athletics, Insight, Intimidation, Medicine, Persuasion, and Religion
	`,featureOptions:{placeholderText:"Select skills",options:["Athletics","Insight","Intimidation","Medicine","Persuasion","Religion"],numPicks:2},source:"paladin.proficiencies"},zo={name:"Divine Sense",description:`
		As an action, you can open your awareness to detect good and evil until the start of your next turn. 
		You can use this feature a number of times equal to 1 + your Charisma modifier per long rest.
	`,source:"paladin"},qo={name:"Lay on Hands",description:`
		You have a pool of healing power that replenishes when you take a long rest. 
		With that pool, you can restore a total number of hit points equal to your Paladin level × 5.
		As an action, you can touch a creature to restore any number of hit points remaining in the pool.
	`,source:"paladin"},No={name:"Fighting Style",description:"Choose a fighting style to enhance your combat ability.",featureOptions:{placeholderText:"-Choose a Fighting Style-",options:[{name:"Defense",optionDescription:"While you are wearing armor, you gain a +1 bonus to AC."},{name:"Dueling",optionDescription:"When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon."},{name:"Great Weapon Fighting",optionDescription:"When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll."},{name:"Protection",optionDescription:"When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll."}],numPicks:1},source:"paladin"},jo={name:"Spellcasting",description:`
		You can cast prepared paladin spells using Charisma as your spellcasting ability. 
		At level 3, you gain access to 1st-level paladin spells.
	`,source:"paladin"},Eo={name:"Divine Smite",description:`
		When you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage in addition to the weapon's damage.
		The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st.
	`,source:"paladin"},Uo={name:"Sacred Oath",description:"Choose a Sacred Oath at 3rd level.",featureOptions:{placeholderText:"-Choose an Oath-",options:[{name:"Oath of Devotion",optionDescription:`
					You strive to be a paragon of virtue and justice.
				`,nestedPrompts:[{name:"Oath Spells",description:"You gain oath-specific spells at certain levels (not applicable at level 3).",source:"paladin.oath_devotion"},{name:"Sacred Weapon",description:"You can add your Charisma modifier to attack rolls with a weapon.",source:"paladin.oath_devotion"},{name:"Turn the Unholy",description:"As an action, you can censure fiends and undead.",source:"paladin.oath_devotion"}]},{name:"Oath of the Ancients",optionDescription:`
					You fight for the light and life in the world.
				`,nestedPrompts:[{name:"Oath Spells",description:"You gain oath-specific spells at certain levels (not applicable at level 3).",source:"paladin.oath_ancients"},{name:"Nature’s Wrath",description:"You can invoke spectral guardians to hinder foes.",source:"paladin.oath_ancients"},{name:"Turn the Faithless",description:"As an action, you can censure fey and fiends.",source:"paladin.oath_ancients"}]}],numPicks:1},source:"paladin"},Qo=[zo,qo,No,jo,Eo],Vo={name:"Paladin",image:P+"/class_icons/paladin.jpg",description:"Holy warriors bound by sacred oaths, wielding divine power to protect and smite.",hitDie:"d10",primaryAbility:"Strength & Charisma",saves:["Wisdom","Charisma"],armorProficiencies:["All Armor","Shields"],weaponProficiencies:["Simple Weapons","Martial Weapons"],classFeatures:[Lo,...Qo,Uo]},Go={name:"Skill Proficiencies",description:`
		Armor: Light armor, medium armor, shields <br>
		Weapons: Simple weapons, martial weapons <br>
		Saving Throws: Strength, Dexterity <br>
		Skills: Choose three from Animal Handling, Athletics, Insight, Investigation, Nature, Perception, Stealth, and Survival
	`,featureOptions:{placeholderText:"Select skills",options:["Animal Handling","Athletics","Insight","Investigation","Nature","Perception","Stealth","Survival"],numPicks:3},source:"ranger.proficiencies"},Ko={name:"Fighting Style",description:"Choose a fighting style to suit your combat approach.",featureOptions:{placeholderText:"-Choose a Fighting Style-",options:[{name:"Archery",optionDescription:"You gain a +2 bonus to attack rolls you make with ranged weapons."},{name:"Defense",optionDescription:"While you are wearing armor, you gain a +1 bonus to AC."},{name:"Dueling",optionDescription:"When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon."},{name:"Two-Weapon Fighting",optionDescription:"When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack."}],numPicks:1},source:"ranger"},Jo={name:"Spellcasting",description:`
		You have learned to cast ranger spells using Wisdom as your spellcasting ability. 
		At level 3, you know three 1st-level spells and have two 1st-level spell slots.
	`,source:"ranger"},Xo={name:"Ranger Archetype",description:"Choose a Ranger Archetype at 3rd level.",featureOptions:{placeholderText:"-Choose an Archetype-",options:[{name:"Hunter",optionDescription:`
					You focus on the art of hunting and gain abilities that improve your combat effectiveness.
				`,nestedPrompts:[{name:"Hunter’s Prey",description:"Choose one of the following options:",featureOptions:{placeholderText:"-Choose an Option-",options:[{name:"Colossus Slayer",optionDescription:"Extra 1d8 damage once per turn to creatures below their max HP."},{name:"Giant Killer",optionDescription:"When a Large or larger creature attacks you, you can use your reaction to attack it immediately."},{name:"Horde Breaker",optionDescription:"Once per turn, you can make an additional attack against a different creature within 5 feet of the original target."}],numPicks:1},source:"ranger.hunter"}]},{name:"Beast Master",optionDescription:`
					You gain a beast companion to fight alongside you.
				`,nestedPrompts:[{name:"Ranger’s Companion",description:`
							You gain a beast companion that accompanies you on adventures and battles.
						`,source:"ranger.beast_master"}]}],numPicks:1},source:"ranger"},Zo=[Ko,Jo,Xo],ea={name:"Ranger",image:P+"/class_icons/ranger.jpg",description:"Skilled hunters and trackers, masters of nature and survival.",hitDie:"d10",primaryAbility:"Dexterity & Wisdom",saves:["Strength","Dexterity"],armorProficiencies:["Light Armor","Medium Armor","Shields"],weaponProficiencies:["Simple Weapons","Martial Weapons"],classFeatures:[Go,...Zo]},oa={name:"Skill Proficiencies",description:`
		Armor: Light armor <br>
		Weapons: Simple weapons, hand crossbows, longswords, rapiers, shortswords <br>
		Saving Throws: Dexterity, Intelligence <br>
		Skills: Choose four from Acrobatics, Athletics, Deception, Insight, Intimidation, Investigation, Perception, Performance, Persuasion, Sleight of Hand, Stealth
	`,featureOptions:{placeholderText:"Select skills",options:["Acrobatics","Athletics","Deception","Insight","Intimidation","Investigation","Perception","Performance","Persuasion","Sleight of Hand","Stealth"],numPicks:4},source:"rogue.proficiencies"},aa={name:"Sneak Attack",description:`
		Beginning at 1st level, you know how to strike subtly and exploit a foe’s distraction. 
		Once per turn, you can deal an extra 2d6 damage to one creature you hit with an attack if you have advantage on the attack roll. 
		The attack must use a finesse or a ranged weapon.
	`,source:"rogue"},ia={name:"Cunning Action",description:`
		Starting at 2nd level, your quick thinking and agility allow you to move and act quickly. 
		You can take a bonus action on each of your turns in combat to Dash, Disengage, or Hide.
	`,source:"rogue"},ta={name:"Roguish Archetype",description:"Choose a Roguish Archetype at 3rd level.",featureOptions:{placeholderText:"-Choose an Archetype-",options:[{name:"Thief",optionDescription:`
					Fast hands and second-story work. You gain the ability to use the Use Magic Device feature and climb faster.
				`,nestedPrompts:[{name:"Fast Hands",description:`
							You can use the bonus action granted by your Cunning Action to make a Dexterity (Sleight of Hand) check, use your thieves’ tools to disarm a trap or open a lock, or take the Use Object action.
						`,source:"rogue.thief"},{name:"Second-Story Work",description:`
							When you make a running jump, the distance you cover increases by a number of feet equal to your Dexterity modifier. 
							In addition, climbing no longer costs you extra movement.
						`,source:"rogue.thief"}]},{name:"Assassin",optionDescription:`
					You are an expert at infiltration, disguise, and dealing deadly strikes.
				`,nestedPrompts:[{name:"Assassinate",description:`
							Starting at 3rd level, you have advantage on attack rolls against any creature that hasn’t taken a turn in the combat yet. 
							In addition, any hit you score against a creature that is surprised is a critical hit.
						`,source:"rogue.assassin"}]},{name:"Arcane Trickster",optionDescription:`
					You gain limited spellcasting and the ability to use magic to enhance your trickery.
				`,nestedPrompts:[{name:"Spellcasting",description:`
							You know three cantrips and three 1st-level spells from the wizard spell list, focusing on enchantment and illusion spells.
						`,source:"rogue.arcane_trickster"},{name:"Mage Hand Legerdemain",description:`
							When you cast Mage Hand, the spectral hand is invisible, and you can use it to pick locks and pockets, and perform other tasks.
						`,source:"rogue.arcane_trickster"}]}],numPicks:1},source:"rogue"},na=[aa,ia],ra={name:"Rogue",image:P+"/class_icons/rogue.jpg",description:"Sneaky and dexterous masters of stealth and trickery.",hitDie:"d8",primaryAbility:"Dexterity",saves:["Dexterity","Intelligence"],armorProficiencies:["Light Armor"],weaponProficiencies:["Simple Weapons","Hand Crossbows","Longswords","Rapiers","Shortswords"],classFeatures:[oa,...na,ta]},sa={name:"Skill Proficiencies",description:`
		Armor: None <br>
		Weapons: Daggers, darts, slings, quarterstaffs, light crossbows <br>
		Saving Throws: Constitution, Charisma <br>
		Skills: Choose two from Arcana, Deception, Insight, Intimidation, Persuasion, and Religion
	`,featureOptions:{placeholderText:"Select skills",options:["Arcana","Deception","Insight","Intimidation","Persuasion","Religion"],numPicks:2},source:"sorcerer.proficiencies"},ca={name:"Spellcasting",description:`
		You know four cantrips of your choice from the sorcerer spell list. 
		You know two 1st-level spells of your choice.
		You can cast spells using Charisma as your spellcasting ability.
	`,source:"sorcerer"},la={name:"Sorcery Points",description:`
		Starting at 2nd level, you can use sorcery points to fuel your metamagic. 
		You have a number of sorcery points equal to your sorcerer level (3).
		You regain all expended sorcery points when you finish a long rest.
	`,source:"sorcerer"},pa={name:"Metamagic",description:"Choose two Metamagic options to customize your spells.",featureOptions:{placeholderText:"-Choose Metamagic-",options:[{name:"Careful Spell",optionDescription:"When you cast a spell that forces other creatures to make a saving throw, you can protect some of those creatures from the effect."},{name:"Distant Spell",optionDescription:"When you cast a spell with a range of 5 feet or greater, you can double the range."},{name:"Empowered Spell",optionDescription:"When you roll damage for a spell, you can reroll a number of damage dice up to your Charisma modifier."},{name:"Extended Spell",optionDescription:"When you cast a spell with a duration of 1 minute or longer, you can double the duration."},{name:"Heightened Spell",optionDescription:"You can give one target of a spell disadvantage on its first saving throw made against the spell."},{name:"Quickened Spell",optionDescription:"You can cast a spell that has a casting time of 1 action as a bonus action instead."},{name:"Subtle Spell",optionDescription:"You can cast a spell without any somatic or verbal components."},{name:"Twinned Spell",optionDescription:"When you cast a spell that targets only one creature and doesn’t have a range of self, you can target a second creature."}],numPicks:2},source:"sorcerer"},ua={name:"Sorcerous Origin",description:"Choose your Sorcerous Origin at 1st level.",featureOptions:{placeholderText:"-Choose an Origin-",options:[{name:"Draconic Bloodline",optionDescription:`
					You have draconic ancestry that grants you additional resilience and elemental affinity.
				`,nestedPrompts:[{name:"Draconic Resilience",description:`
							Your hit point maximum increases by 1 per sorcerer level. 
							Your AC equals 13 + your Dexterity modifier when not wearing armor.
						`,source:"sorcerer.draconic_bloodline"},{name:"Elemental Affinity",description:`
							When you cast a spell that deals damage of the type associated with your draconic ancestry, 
							you can add your Charisma modifier to one damage roll of that spell.
						`,source:"sorcerer.draconic_bloodline"}]},{name:"Wild Magic",optionDescription:`
					Your innate magic is unpredictable and chaotic, causing surges of random magical effects.
				`,nestedPrompts:[{name:"Wild Magic Surge",description:`
							Beginning at 1st level, your spellcasting can unleash surges of wild magic.
							Your DM might ask you to roll on the Wild Magic Surge table after you cast a sorcerer spell.
						`,source:"sorcerer.wild_magic"},{name:"Tides of Chaos",description:`
							You can gain advantage on one attack roll, ability check, or saving throw. 
							Once you use this feature, you must finish a long rest before you can use it again.
						`,source:"sorcerer.wild_magic"}]}],numPicks:1},source:"sorcerer"},da=[ca,la,pa],ma={name:"Sorcerer",image:P+"/class_icons/sorcerer.jpg",description:"Spellcasters who draw power from innate magical bloodlines or forces.",hitDie:"d6",primaryAbility:"Charisma",saves:["Constitution","Charisma"],armorProficiencies:[],weaponProficiencies:["Daggers","Darts","Slings","Quarterstaffs","Light Crossbows"],classFeatures:[sa,...da,ua]},ha={name:"Skill Proficiencies",description:`
		Armor: Light armor <br>
		Weapons: Simple weapons <br>
		Saving Throws: Wisdom, Charisma <br>
		Skills: Choose two from Arcana, Deception, History, Intimidation, Investigation, Nature, and Religion
	`,featureOptions:{placeholderText:"Select skills",options:["Arcana","Deception","History","Intimidation","Investigation","Nature","Religion"],numPicks:2},source:"warlock.proficiencies"},ga={name:"Otherworldly Patron",description:"Choose your Otherworldly Patron at 1st level.",featureOptions:{placeholderText:"-Choose a Patron-",options:[{name:"The Archfey",optionDescription:`
					Your patron is a powerful being from the Feywild who grants you enchantment and illusion powers.
				`,nestedPrompts:[{name:"Fey Presence",description:`
							As an action, you can cause creatures in a 10-foot cube to make a Wisdom saving throw or be charmed or frightened until the end of your next turn.
							You can use this feature once per short or long rest.
						`,source:"warlock.archfey"}]},{name:"The Fiend",optionDescription:`
					Your patron is a fiendish entity who grants you destructive fire and survival powers.
				`,nestedPrompts:[{name:"Dark One’s Blessing",description:`
							When you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Charisma modifier + your warlock level.
						`,source:"warlock.fiend"}]},{name:"The Great Old One",optionDescription:`
					Your patron is a mysterious entity from beyond reality, granting telepathic and madness-related powers.
				`,nestedPrompts:[{name:"Awakened Mind",description:`
							You can communicate telepathically with any creature you can see within 30 feet.
						`,source:"warlock.great_old_one"}]}],numPicks:1},source:"warlock"},fa={name:"Pact Magic",description:`
		You know two cantrips of your choice from the warlock spell list.
		You know two 1st-level spells.
		You regain spell slots on a short or long rest.
		You use Charisma as your spellcasting ability.
	`,source:"warlock"},ya={name:"Eldritch Invocations",description:`
		At 2nd level, you gain two eldritch invocations of your choice.
		These grant you various magical abilities.
	`,source:"warlock",featureOptions:{placeholderText:"Select two Invocations",options:["Agonizing Blast","Armor of Shadows","Beast Speech","Beguiling Influence","Devil’s Sight","Eldritch Sight","Fiendish Vigor","Mask of Many Faces"],numPicks:2}},va=[fa,ya],wa={name:"Warlock",image:P+"/class_icons/warlock.jpg",description:"A wielder of magic granted by a pact with an otherworldly being.",hitDie:"d8",primaryAbility:"Charisma",saves:["Wisdom","Charisma"],armorProficiencies:["Light Armor"],weaponProficiencies:["Simple Weapons"],classFeatures:[ha,...va,ga]},ba={name:"Skill Proficiencies",description:`
		Weapons: Daggers, darts, slings, quarterstaffs, light crossbows <br>
		Saving Throws: Intelligence, Wisdom <br>
		Skills: Choose two from Arcana, History, Insight, Investigation, Medicine, and Religion
	`,featureOptions:{placeholderText:"Select skills",options:["Arcana","History","Insight","Investigation","Medicine","Religion"],numPicks:2},source:"wizard.proficiencies"},ka={name:"Arcane Recovery",description:`
		Once per day when you finish a short rest, you can recover expended spell slots with a combined level equal to or less than half your wizard level (rounded up).
	`,source:"wizard"},Pa={name:"Spellcasting",description:`
		You know three cantrips from the wizard spell list.
		You know six 1st-level wizard spells.
		You prepare spells from your spellbook, using Intelligence as your spellcasting ability.
	`,source:"wizard"},Sa={name:"Arcane Tradition",description:"Choose an Arcane Tradition at 2nd level.",featureOptions:{placeholderText:"-Choose an Arcane Tradition-",options:[{name:"School of Evocation",optionDescription:`
					You focus on spells that manipulate energy and produce powerful effects.
					At 2nd level, you gain features that allow you to sculpt evocation spells.
				`,nestedPrompts:[{name:"Evocation Savant",description:`
							The gold and time you must spend to copy an evocation spell into your spellbook is halved.
						`,source:"wizard.evocation"},{name:"Sculpt Spells",description:`
							When you cast an evocation spell that affects other creatures you can see, you can protect some of them from the spell’s full force.
						`,source:"wizard.evocation"}]},{name:"School of Illusion",optionDescription:`
					You specialize in illusion magic, enhancing your ability to deceive.
				`,nestedPrompts:[{name:"Illusion Savant",description:`
							The gold and time you must spend to copy an illusion spell into your spellbook is halved.
						`,source:"wizard.illusion"},{name:"Improved Minor Illusion",description:`
							When you cast Minor Illusion, you can create both a sound and an image with a single casting.
						`,source:"wizard.illusion"}]}],numPicks:1},source:"wizard"},_a=[ka,Pa,Sa],Aa={name:"Wizard",image:P+"/class_icons/wizard.jpg",description:"Scholars of magic who manipulate arcane forces through study and practice.",hitDie:"d6",primaryAbility:"Intelligence",saves:["Intelligence","Wisdom"],armorProficiencies:[],weaponProficiencies:["Daggers","Darts","Slings","Quarterstaffs","Light Crossbows"],classFeatures:[ba,..._a]};var Da=k('<button class="class-card svelte-kwt7ml"><div class="card-left svelte-kwt7ml"><img class="svelte-kwt7ml"/> <span> </span></div> <img class="card-arrow svelte-kwt7ml" alt="next arrow"/></button>'),Ca=k('<div class="class-cards svelte-kwt7ml"></div>'),Wa=k('<div class="feature-card svelte-kwt7ml"><h4 class="svelte-kwt7ml"> </h4> <p><!></p></div>'),Ya=k('<div class="popup svelte-kwt7ml"><div class="popup-content svelte-kwt7ml"><div class="popup-header svelte-kwt7ml"><span>CONFIRM ADD CLASS</span> <button class="close-button svelte-kwt7ml">×</button></div> <div class="popup-body svelte-kwt7ml"><h2> </h2> <p class="description svelte-kwt7ml"> </p> <p><strong>Primary Ability:</strong> </p> <!></div> <div class="popup-footer svelte-kwt7ml"><button class="cancel-button">Cancel</button> <button class="add-button">Add Class</button></div></div></div>'),Ta=k("<option> </option>"),Oa=k('<select class="svelte-kwt7ml"><option disabled selected> </option><!></select>'),xa=k("<option> </option>"),Ia=k('<select class="svelte-kwt7ml"><option disabled selected> </option><!></select>'),Ma=k('<div class="feature-card nested svelte-kwt7ml"><h4 class="svelte-kwt7ml"> </h4> <p><!></p> <!></div>'),Ha=k("<!> <!>",1),Fa=k('<div class="feature-card svelte-kwt7ml"><h4 class="svelte-kwt7ml"> </h4> <p><!></p> <!></div>'),Ra=k('<div class="selected-class-section svelte-kwt7ml"><h2 class="svelte-kwt7ml"> <button aria-label="Remove selected class" class="svelte-kwt7ml">✕</button></h2> <!></div>'),$a=k(`<div class="main-content svelte-kwt7ml"><h2>Class Selection</h2> <p>In Dungeons & Dragons, your character's class defines their role in the party,
		abilities, and how they interact with the world. Each class offers unique strengths,
		weaknesses, and ways to play.</p> <!> <!> <!></div>`);function Ga(h,S){Ge(S,!1);const M=ce(),D=[to,mo,wo,Ao,xo,Bo,Vo,ea,ra,ma,wa,Aa];let d=ce(null),w=ce(null),i=ce({});function H(r,p,u){e(i)[r.name]||De(i,e(i)[r.name]=Array(r.featureOptions?.numPicks||1).fill(null));const s=e(i)[r.name][p];De(i,e(i)[r.name][p]=u),s!==u&&C(r,e(i))}function C(r,p){if(r.featureOptions){for(const u of r.featureOptions.options)if(typeof u!="string"&&u.nestedPrompts)for(const s of u.nestedPrompts)delete p[s.name]}}function ee(r,p){const u=r.featureOptions?.options||[],s=e(i)[r.name]||[];return u.filter(g=>{const W=typeof g=="string"?g:g.name;return!s.some((b,t)=>b===W&&t!==p)})}function B(r,p){if(!r.featureOptions)return[];const u=[];for(const s of r.featureOptions.options){const g=typeof s=="string"?s:s.name;p.includes(g)&&typeof s!="string"&&s.nestedPrompts&&u.push(...s.nestedPrompts)}return u}function O(){T(w,null),T(d,null),T(i,{})}function Ye(){e(d)&&(T(w,e(d)),T(d,null),T(i,{}))}Ke(()=>e(w),()=>{T(M,e(w)?[...e(w).classFeatures||[]]:[])}),Je(),eo();var le=$a(),ye=c(n(le),4);{var Te=r=>{var p=Ca();$(p,5,()=>D,j,(u,s)=>{var g=Da(),W=n(g),b=n(W),t=c(b,2),x=n(t,!0);a(t),a(W);var L=c(W,2);a(g),Y(()=>{he(b,"src",(e(s),o(()=>e(s).image))),he(b,"alt",(e(s),o(()=>`${e(s).name} icon`))),A(x,(e(s),o(()=>e(s).name))),he(L,"src",`${P??""}/basic_icons/blue_next.png`)}),N("click",g,()=>T(d,e(s))),v(u,g)}),a(p),v(r,p)};Z(ye,r=>{e(w)||r(Te)})}var ve=c(ye,2);{var Oe=r=>{var p=Ya(),u=n(p),s=n(u),g=c(n(s),2);a(s);var W=c(s,2),b=n(W),t=n(b,!0);a(b);var x=c(b,2),L=n(x,!0);a(x);var E=c(x,2),U=c(n(E));a(E);var pe=c(E,2);$(pe,1,()=>(e(d),o(()=>e(d).classFeatures)),j,(ie,z)=>{var V=Wa(),I=n(V),l=n(I,!0);a(I);var _=c(I,2),f=n(_);ge(f,()=>(e(z),o(()=>e(z).description))),a(_),a(V),Y(()=>A(l,(e(z),o(()=>e(z).name)))),v(ie,V)}),a(W);var oe=c(W,2),ae=n(oe),Q=c(ae,2);a(oe),a(u),a(p),Y(()=>{A(t,(e(d),o(()=>e(d).name))),A(L,(e(d),o(()=>e(d).description))),A(U,` ${e(d),o(()=>e(d).primaryAbility)??""}`)}),N("click",g,()=>T(d,null)),N("click",ae,()=>T(d,null)),N("click",Q,Ye),v(r,p)};Z(ve,r=>{e(d)&&r(Oe)})}var xe=c(ve,2);{var Ie=r=>{var p=Ra(),u=n(p),s=n(u),g=c(s);a(u);var W=c(u,2);$(W,1,()=>e(M),b=>b.name,(b,t)=>{var x=Fa(),L=n(x),E=n(L,!0);a(L);var U=c(L,2),pe=n(U);ge(pe,()=>(e(t),o(()=>e(t).description))),a(U);var oe=c(U,2);{var ae=Q=>{var ie=Ha(),z=Ae(ie);$(z,1,()=>(e(t),o(()=>Array(e(t).featureOptions.numPicks))),j,(I,l,_)=>{var f=Oa(),q=n(f),G=n(q,!0);a(q),q.value=q.__value="";var ue=c(q);$(ue,1,()=>(e(t),o(()=>ee(e(t),_))),j,(K,m)=>{var F=Ta(),de=n(F,!0);a(F);var ne={};Y(()=>{A(de,(e(m),o(()=>typeof e(m)=="string"?e(m):e(m).name))),ne!==(ne=(e(m),o(()=>typeof e(m)=="string"?e(m):e(m).name)))&&(F.value=(F.__value=(e(m),o(()=>typeof e(m)=="string"?e(m):e(m).name)))??"")}),v(K,F)}),a(f);var te;Ce(f),Y(()=>{A(G,(e(t),o(()=>e(t).featureOptions.placeholderText||"Select an option"))),te!==(te=(e(i),e(t),o(()=>e(i)[e(t).name]?.[_]||"")))&&(f.value=(f.__value=(e(i),e(t),o(()=>e(i)[e(t).name]?.[_]||"")))??"",fe(f,(e(i),e(t),o(()=>e(i)[e(t).name]?.[_]||""))))}),N("change",f,K=>{const m=K.target;H(e(t),_,m.value)}),v(I,f)});var V=c(z,2);$(V,1,()=>(e(t),e(i),o(()=>B(e(t),e(i)[e(t).name]||[]))),I=>I.name,(I,l)=>{var _=Ma(),f=n(_),q=n(f,!0);a(f);var G=c(f,2),ue=n(G);ge(ue,()=>(e(l),o(()=>e(l).description))),a(G);var te=c(G,2);{var K=m=>{var F=Ze(),de=Ae(F);$(de,1,()=>(e(l),o(()=>Array(e(l).featureOptions.numPicks))),j,(ne,Ba,re)=>{var R=Ia(),J=n(R),Me=n(J,!0);a(J),J.value=J.__value="";var He=c(J);$(He,1,()=>(e(l),o(()=>e(l).featureOptions.options)),j,(me,y)=>{var X=xa(),Fe=n(X,!0);a(X);var be={};Y(()=>{A(Fe,(e(y),o(()=>typeof e(y)=="string"?e(y):e(y).name))),be!==(be=(e(y),o(()=>typeof e(y)=="string"?e(y):e(y).name)))&&(X.value=(X.__value=(e(y),o(()=>typeof e(y)=="string"?e(y):e(y).name)))??"")}),v(me,X)}),a(R);var we;Ce(R),Y(()=>{A(Me,(e(l),o(()=>e(l).featureOptions.placeholderText||"Select an option"))),we!==(we=(e(i),e(l),o(()=>e(i)[e(l).name]?.[re]||"")))&&(R.value=(R.__value=(e(i),e(l),o(()=>e(i)[e(l).name]?.[re]||"")))??"",fe(R,(e(i),e(l),o(()=>e(i)[e(l).name]?.[re]||""))))}),N("change",R,me=>{const y=me.target;H(e(l),re,y.value)}),v(ne,R)}),v(m,F)};Z(te,m=>{e(l),o(()=>e(l).featureOptions)&&m(K)})}a(_),Y(()=>A(q,(e(l),o(()=>e(l).name)))),v(I,_)}),v(Q,ie)};Z(oe,Q=>{e(t),o(()=>e(t).featureOptions)&&Q(ae)})}a(x),Y(()=>A(E,(e(t),o(()=>e(t).name)))),v(b,x)}),a(p),Y(()=>A(s,`${e(w),o(()=>e(w).name)??""} `)),N("click",g,O),v(r,p)};Z(xe,r=>{e(w)&&r(Ie)})}a(le),v(h,le),Xe()}export{Ga as component};

import"../chunks/DsnmJJEf.js";import"../chunks/69_IOA4Y.js";import{aA as T,h as Te,a as xe,J as Xe,aQ as Ze,k as Oe,C as eo,B as oo,aI as ao,aH as to,ac as Ie,s as io,ab as no,l as de,ad as ro,w as so,aR as co,aS as lo,R as po,aT as uo,aU as mo,S as k,T as v,V as ho,aq as S,m as e,t as re,W as c,X as i,Y as a,a3 as o,az as ke,aC as go,aV as Me}from"../chunks/CwIXl9NE.js";import{s as b,e as $}from"../chunks/XqYqyXl2.js";import{i as Q}from"../chunks/C1VzLvfn.js";import{e as B,i as V}from"../chunks/Da8oe64x.js";import{s as se}from"../chunks/qkL-XxoW.js";import{i as fo}from"../chunks/VA2OuYhv.js";import{b as _}from"../chunks/DbOKgLd0.js";function Pe(y,A,M=!1,C=!1,d=!1){var m=y,r="";T(()=>{var g=Xe;if(r===(r=A()??"")){Te&&xe();return}if(g.nodes_start!==null&&(Ze(g.nodes_start,g.nodes_end),g.nodes_start=g.nodes_end=null),r!==""){if(Te){Oe.data;for(var W=xe(),G=W;W!==null&&(W.nodeType!==eo||W.data!=="");)G=W,W=oo(W);if(W===null)throw ao(),to;Ie(Oe,G),m=io(W);return}var L=r+"";M?L=`<svg>${L}</svg>`:C&&(L=`<math>${L}</math>`);var x=no(L);if((M||C)&&(x=de(x)),Ie(de(x),x.lastChild),M||C)for(;de(x);)m.before(de(x));else m.before(x)}})}function Se(y,A,M=!1){if(y.multiple){if(A==null)return;if(!so(A))return co();for(var C of y.options)C.selected=A.includes(Fe(C));return}for(C of y.options){var d=Fe(C);if(lo(d,A)){C.selected=!0;return}}(!M||A!==void 0)&&(y.selectedIndex=-1)}function He(y){var A=new MutationObserver(()=>{Se(y,y.__value)});A.observe(y,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),ro(()=>{A.disconnect()})}function Fe(y){return"__value"in y?y.__value:y.value}const yo={name:"Skill Proficiencies",description:`
		Armor: Light armor, medium armor, shields <br>
		Weapons: Simple weapons, martial weapons <br>
		Saving Throws: Strength, Constitution <br>
		Skills: Choose two from Animal Handling, Athletics, Intimidation, Nature, Perception, and Survival
	`,featureOptions:{placeholderText:"",options:["Animal Handling","Athletics","Intimidation","Nature","Perception","Survival"],numPicks:2},source:"barbarian.proficiencies"},vo={name:"Primal Path",description:"Choose a path that shapes the nature of your rage.",featureOptions:{placeholderText:"-Choose an Option-",options:[{name:"Berserker",optionDescription:" 					For some barbarians, rage is a means to an end — that end being violence. 					The Path of the Berserker is a path of untrammeled fury, slick with blood. 					As you enter the berserker’s rage, you thrill in the chaos of battle, heedless of your own health or well-being. 				",nestedPrompts:[{name:"Frenzy",description:" 							Starting when you choose this path at 3rd level, you can go into a frenzy when you rage. 							If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. 							When your rage ends, you suffer one level of exhaustion. 						",source:"barbarian.berserker"}]},{name:"Totem Warrior",optionDescription:" 					The Path of the Totem Warrior is a spiritual journey, as the barbarian accepts a spirit animal as guide, protector, and inspiration. 					In battle, your totem spirit fills you with supernatural might, adding magical fuel to your barbarian rage. 				",nestedPrompts:[{name:"Spirit Seeker",description:" 							Yours is a path that seeks attunement with the natural world, giving you a kinship with beasts. 							You gain the ability to cast the beast sense and speak with animals spells, 							but only as rituals, as described in the Spellcasting section. 						",source:"barbarian.totem_warrior"},{name:"Totem Spirit",description:" 							Choose a totem spirit and gain its feature. 							At 3rd level when you adopt this path, you gain the ability to cast the beast sense and speak with animals spells, 							but only as rituals, as described in the Spellcasting section. 						",source:"barbarian.totem_warrior"}]}],numPicks:1},source:"barbarian"},wo=[{name:"Rage",description:"In battle, you fight with primal ferocity. You can enter a rage as a bonus action...",source:"barbarian"},{name:"Unarmored Defense",description:"While not wearing armor, your AC equals 10 + Dex modifier + Con modifier.",source:"barbarian"},{name:"Reckless Attack",description:"You can throw aside all concern for defense to attack with fierce desperation.",source:"barbarian"},{name:"Danger Sense",description:"You have advantage on Dexterity saving throws against effects you can see.",source:"barbarian"}],bo={name:"Barbarian",image:_+"/class_icons/barbarian.jpg",description:"Frenzied warriors fueled by primal rage.",hitDie:"d12",primaryAbility:"Strength",saves:["Strength","Constitution"],armorProficiencies:["Light Armor","Medium Armor","Shields"],weaponProficiencies:["Simple Weapons","Martial Weapons"],classFeatures:[yo,...wo,vo]},ko={name:"Skill Proficiencies",description:`
		Armor: Light armor <br>
		Weapons: Simple weapons, hand crossbows, longswords, rapiers, shortswords <br>
		Saving Throws: Dexterity, Charisma <br>
		Skills: Choose any three
	`,featureOptions:{placeholderText:"Select skills",options:["Acrobatics","Animal Handling","Arcana","Athletics","Deception","History","Insight","Intimidation","Investigation","Medicine","Nature","Perception","Performance","Persuasion","Religion","Sleight of Hand","Stealth","Survival"],numPicks:3},source:"bard.proficiencies"},Po={name:"Bardic Inspiration",description:`
		You can inspire others through stirring words or music. 
		Use a bonus action to give one creature other than yourself within 60 feet an inspiration die (a d6). 
		This die can be added to ability checks, attack rolls, or saving throws.
		You can use this feature a number of times equal to your Charisma modifier (minimum of once), and regain all uses on a long rest.
	`,source:"bard"},So={name:"Spellcasting",description:`
		You know two cantrips of your choice from the bard spell list. 
		You know four 1st-level spells of your choice.
		You can cast spells using Charisma as your spellcasting ability.
	`,source:"bard"},_o={name:"Jack of All Trades",description:`
		Starting at 2nd level, you can add half your proficiency bonus, rounded down, to any ability check you make that doesn’t already include your proficiency bonus.
	`,source:"bard"},Ao={name:"Song of Rest",description:`
		Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest. 
		If you or any friendly creatures who can hear your performance regain hit points by spending Hit Dice at the end of the short rest, each of those creatures regains an extra 1d6 hit points.
	`,source:"bard"},Do={name:"Bard College",description:"Choose a Bard College at 3rd level.",featureOptions:{placeholderText:"-Choose a College-",options:[{name:"College of Lore",optionDescription:`
					You learn additional magical secrets and gain Cutting Words to hinder foes.
				`,nestedPrompts:[{name:"Bonus Proficiencies",description:"You gain proficiency with three skills of your choice.",featureOptions:{placeholderText:"Select three skills",options:["Acrobatics","Animal Handling","Arcana","Athletics","Deception","History","Insight","Intimidation","Investigation","Medicine","Nature","Perception","Performance","Persuasion","Religion","Sleight of Hand","Stealth","Survival"],numPicks:3},source:"bard.college_of_lore"},{name:"Cutting Words",description:`
							When a creature you can see within 60 feet makes an attack roll, ability check, or damage roll, 
							you can use your reaction to expend one use of Bardic Inspiration, subtracting the roll from the creature’s roll.
						`,source:"bard.college_of_lore"}]},{name:"College of Valor",optionDescription:`
					You gain proficiency with medium armor, shields, and martial weapons. 
					You can inspire others to fight with valor.
				`,nestedPrompts:[{name:"Bonus Proficiencies",description:"You gain proficiency with medium armor, shields, and martial weapons.",source:"bard.college_of_valor"},{name:"Combat Inspiration",description:`
							Your Bardic Inspiration can be used to add to damage rolls or AC as well as ability checks, attack rolls, and saving throws.
						`,source:"bard.college_of_valor"}]}],numPicks:1},source:"bard"},Co=[Po,So,_o,Ao],Wo={name:"Bard",image:_+"/class_icons/bard.jpg",description:"Inspiring leaders who weave magic through words and music.",hitDie:"d8",primaryAbility:"Charisma",saves:["Dexterity","Charisma"],armorProficiencies:["Light Armor"],weaponProficiencies:["Simple Weapons","Hand Crossbows","Longswords","Rapiers","Shortswords"],classFeatures:[ko,...Co,Do]},Yo={name:"Skill Proficiencies",description:`
		Armor: Light armor, medium armor, shields <br>
		Weapons: Simple weapons <br>
		Saving Throws: Wisdom, Charisma <br>
		Skills: Choose two from History, Insight, Medicine, Persuasion, Religion
	`,featureOptions:{placeholderText:"Select two skills",options:["History","Insight","Medicine","Persuasion","Religion"],numPicks:2},source:"cleric.proficiencies"},To={name:"Spellcasting",description:`
		You can prepare and cast spells using Wisdom as your spellcasting ability. 
		You know three cantrips and have prepared a number of spells equal to your Wisdom modifier + cleric level.
	`,source:"cleric"},xo={name:"Channel Divinity",description:`
		Starting at 2nd level, you can use Channel Divinity to fuel magical effects. 
		You have one use per short or long rest.
	`,source:"cleric"},Oo={name:"Divine Domain",description:"Choose a Divine Domain at 1st level. Your choice grants domain features at 1st and 2nd level.",featureOptions:{placeholderText:"-Choose a Domain-",options:[{name:"Life Domain",optionDescription:`
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
						`,source:"cleric.trickery_domain"}]}],numPicks:1},source:"cleric"},Io=[To,xo],Mo={name:"Cleric",image:_+"/class_icons/cleric.jpg",description:"Holy warriors who wield divine magic to heal, protect, and smite foes.",hitDie:"d8",primaryAbility:"Wisdom",saves:["Wisdom","Charisma"],armorProficiencies:["Light Armor","Medium Armor","Shields"],weaponProficiencies:["Simple Weapons"],classFeatures:[Yo,...Io,Oo]},Ho={name:"Skill Proficiencies",description:`
		Armor: Light armor, medium armor (non-metal), shields (non-metal) <br>
		Weapons: Clubs, daggers, darts, javelins, maces, quarterstaffs, scimitars, slings, spears <br>
		Saving Throws: Intelligence, Wisdom <br>
		Skills: Choose two from Arcana, Animal Handling, Insight, Medicine, Nature, Perception, Religion, Survival
	`,featureOptions:{placeholderText:"Select two skills",options:["Arcana","Animal Handling","Insight","Medicine","Nature","Perception","Religion","Survival"],numPicks:2},source:"druid.proficiencies"},Fo={name:"Spellcasting",description:`
		You can prepare and cast spells using Wisdom as your spellcasting ability. 
		You know two cantrips and prepare a number of spells equal to your Wisdom modifier + druid level.
	`,source:"druid"},Ro={name:"Wild Shape",description:`
		Starting at 2nd level, you can use your action to magically assume the shape of a beast you have seen before.
		You can use this feature twice per short or long rest.
	`,source:"druid"},$o={name:"Druid Circle",description:"Choose a Druid Circle at 2nd level.",featureOptions:{placeholderText:"-Choose a Circle-",options:[{name:"Circle of the Land",optionDescription:`
					Your magic draws on the energy of the land, granting you additional spells.
				`,nestedPrompts:[{name:"Bonus Cantrip",description:"You learn one additional druid cantrip.",source:"druid.circle_of_the_land"},{name:"Natural Recovery",description:`
							You can regain some expended spell slots during a short rest.
						`,source:"druid.circle_of_the_land"}]},{name:"Circle of the Moon",optionDescription:`
					You are a fierce shapeshifter, able to transform into more powerful beasts.
				`,nestedPrompts:[{name:"Combat Wild Shape",description:`
							You can use Wild Shape as a bonus action and transform into stronger creatures.
						`,source:"druid.circle_of_the_moon"},{name:"Circle Forms",description:`
							You can transform into beasts with a higher challenge rating than normal.
						`,source:"druid.circle_of_the_moon"}]}],numPicks:1},source:"druid"},Bo=[Fo,Ro],Lo={name:"Druid",image:_+"/class_icons/druid.jpg",description:"Masters of nature magic and shapeshifting, drawing power from the natural world.",hitDie:"d8",primaryAbility:"Wisdom",saves:["Intelligence","Wisdom"],armorProficiencies:["Light Armor","Medium Armor","Shields"],weaponProficiencies:["Clubs","Daggers","Darts","Javelins","Maces","Quarterstaffs","Scimitars","Slings","Spears"],classFeatures:[Ho,...Bo,$o]},zo={name:"Skill Proficiencies",description:`
		Armor: All armor, shields <br>
		Weapons: Simple weapons, martial weapons <br>
		Saving Throws: Strength, Constitution <br>
		Skills: Choose two from Acrobatics, Animal Handling, Athletics, History, Insight, Intimidation, Perception, Survival
	`,featureOptions:{placeholderText:"Select two skills",options:["Acrobatics","Animal Handling","Athletics","History","Insight","Intimidation","Perception","Survival"],numPicks:2},source:"fighter.proficiencies"},No={name:"Fighting Style",description:"Choose a fighting style that suits your combat approach.",featureOptions:{placeholderText:"-Choose a Fighting Style-",options:[{name:"Archery",optionDescription:"You gain a +2 bonus to attack rolls you make with ranged weapons."},{name:"Defense",optionDescription:"While you are wearing armor, you gain a +1 bonus to AC."},{name:"Dueling",optionDescription:"When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls."},{name:"Great Weapon Fighting",optionDescription:"When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon you are wielding with two hands, you can reroll the die."},{name:"Protection",optionDescription:"When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll."},{name:"Two-Weapon Fighting",optionDescription:"When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack."}],numPicks:1},source:"fighter"},qo={name:"Second Wind",description:`
		You have a limited well of stamina that you can draw on to protect yourself from harm. 
		On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. 
		Once you use this feature, you must finish a short or long rest before you can use it again.
	`,source:"fighter"},jo={name:"Action Surge",description:`
		Starting at 2nd level, you can push yourself beyond your normal limits for a moment. 
		On your turn, you can take one additional action on top of your regular action and a possible bonus action. 
		Once you use this feature, you must finish a short or long rest before you can use it again.
	`,source:"fighter"},Eo={name:"Martial Archetype",description:"Choose a Martial Archetype at 3rd level.",featureOptions:{placeholderText:"-Choose an Archetype-",options:[{name:"Champion",optionDescription:`
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
						`,source:"fighter.eldritch_knight"}]}],numPicks:1},source:"fighter"},Uo=[No,qo,jo],Qo={name:"Fighter",image:_+"/class_icons/fighter.jpg",description:"Versatile warriors skilled in all forms of combat.",hitDie:"d10",primaryAbility:"Strength or Dexterity",saves:["Strength","Constitution"],armorProficiencies:["All Armor","Shields"],weaponProficiencies:["Simple Weapons","Martial Weapons"],classFeatures:[zo,...Uo,Eo]},Vo={name:"Skill Proficiencies",description:`
		Armor: None <br>
		Weapons: Simple weapons, shortswords <br>
		Saving Throws: Strength, Dexterity <br>
		Skills: Choose two from Acrobatics, Athletics, History, Insight, Religion, and Stealth
	`,featureOptions:{placeholderText:"Select skills",options:["Acrobatics","Athletics","History","Insight","Religion","Stealth"],numPicks:2},source:"monk.proficiencies"},Go={name:"Martial Arts",description:`
		At 1st level, your practice of martial arts gives you the ability to use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and monk weapons.
		You can roll a d4 in place of the normal damage of your unarmed strike or monk weapon. This die increases as you level.
		When you use the Attack action with an unarmed strike or monk weapon on your turn, you can make one unarmed strike as a bonus action.
	`,source:"monk"},Ko={name:"Ki",description:`
		Starting at 2nd level, you can use your ki to fuel special martial arts techniques.
		You have a number of ki points equal to your monk level, which you can spend to use features like Flurry of Blows, Patient Defense, and Step of the Wind.
		Ki points are regained after a short or long rest.
	`,source:"monk"},Jo={name:"Unarmored Movement",description:`
		Starting at 2nd level, your speed increases by 10 feet while you are not wearing armor or wielding a shield.
	`,source:"monk"},Xo={name:"Monastic Tradition",description:"Choose a monastic tradition (subclass) at 3rd level.",featureOptions:{placeholderText:"-Choose a Tradition-",options:[{name:"Way of the Open Hand",optionDescription:`
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
						`,source:"monk.four_elements"}]}],numPicks:1},source:"monk"},Zo=[Go,Ko,Jo],ea={name:"Monk",image:_+"/class_icons/monk.jpg",description:"Masters of martial arts harnessing the power of ki.",hitDie:"d8",primaryAbility:"Dexterity & Wisdom",saves:["Strength","Dexterity"],armorProficiencies:[],weaponProficiencies:["Simple Weapons","Shortswords"],classFeatures:[Vo,...Zo,Xo]},oa={name:"Skill Proficiencies",description:`
		Armor: All armor, shields <br>
		Weapons: Simple weapons, martial weapons <br>
		Saving Throws: Wisdom, Charisma <br>
		Skills: Choose two from Athletics, Insight, Intimidation, Medicine, Persuasion, and Religion
	`,featureOptions:{placeholderText:"Select skills",options:["Athletics","Insight","Intimidation","Medicine","Persuasion","Religion"],numPicks:2},source:"paladin.proficiencies"},aa={name:"Divine Sense",description:`
		As an action, you can open your awareness to detect good and evil until the start of your next turn. 
		You can use this feature a number of times equal to 1 + your Charisma modifier per long rest.
	`,source:"paladin"},ta={name:"Lay on Hands",description:`
		You have a pool of healing power that replenishes when you take a long rest. 
		With that pool, you can restore a total number of hit points equal to your Paladin level × 5.
		As an action, you can touch a creature to restore any number of hit points remaining in the pool.
	`,source:"paladin"},ia={name:"Fighting Style",description:"Choose a fighting style to enhance your combat ability.",featureOptions:{placeholderText:"-Choose a Fighting Style-",options:[{name:"Defense",optionDescription:"While you are wearing armor, you gain a +1 bonus to AC."},{name:"Dueling",optionDescription:"When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon."},{name:"Great Weapon Fighting",optionDescription:"When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll."},{name:"Protection",optionDescription:"When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll."}],numPicks:1},source:"paladin"},na={name:"Spellcasting",description:`
		You can cast prepared paladin spells using Charisma as your spellcasting ability. 
		At level 3, you gain access to 1st-level paladin spells.
	`,source:"paladin"},ra={name:"Divine Smite",description:`
		When you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage in addition to the weapon's damage.
		The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st.
	`,source:"paladin"},sa={name:"Sacred Oath",description:"Choose a Sacred Oath at 3rd level.",featureOptions:{placeholderText:"-Choose an Oath-",options:[{name:"Oath of Devotion",optionDescription:`
					You strive to be a paragon of virtue and justice.
				`,nestedPrompts:[{name:"Oath Spells",description:"You gain oath-specific spells at certain levels (not applicable at level 3).",source:"paladin.oath_devotion"},{name:"Sacred Weapon",description:"You can add your Charisma modifier to attack rolls with a weapon.",source:"paladin.oath_devotion"},{name:"Turn the Unholy",description:"As an action, you can censure fiends and undead.",source:"paladin.oath_devotion"}]},{name:"Oath of the Ancients",optionDescription:`
					You fight for the light and life in the world.
				`,nestedPrompts:[{name:"Oath Spells",description:"You gain oath-specific spells at certain levels (not applicable at level 3).",source:"paladin.oath_ancients"},{name:"Nature’s Wrath",description:"You can invoke spectral guardians to hinder foes.",source:"paladin.oath_ancients"},{name:"Turn the Faithless",description:"As an action, you can censure fey and fiends.",source:"paladin.oath_ancients"}]}],numPicks:1},source:"paladin"},ca=[aa,ta,ia,na,ra],la={name:"Paladin",image:_+"/class_icons/paladin.jpg",description:"Holy warriors bound by sacred oaths, wielding divine power to protect and smite.",hitDie:"d10",primaryAbility:"Strength & Charisma",saves:["Wisdom","Charisma"],armorProficiencies:["All Armor","Shields"],weaponProficiencies:["Simple Weapons","Martial Weapons"],classFeatures:[oa,...ca,sa]},pa={name:"Skill Proficiencies",description:`
		Armor: Light armor, medium armor, shields <br>
		Weapons: Simple weapons, martial weapons <br>
		Saving Throws: Strength, Dexterity <br>
		Skills: Choose three from Animal Handling, Athletics, Insight, Investigation, Nature, Perception, Stealth, and Survival
	`,featureOptions:{placeholderText:"Select skills",options:["Animal Handling","Athletics","Insight","Investigation","Nature","Perception","Stealth","Survival"],numPicks:3},source:"ranger.proficiencies"},ua={name:"Fighting Style",description:"Choose a fighting style to suit your combat approach.",featureOptions:{placeholderText:"-Choose a Fighting Style-",options:[{name:"Archery",optionDescription:"You gain a +2 bonus to attack rolls you make with ranged weapons."},{name:"Defense",optionDescription:"While you are wearing armor, you gain a +1 bonus to AC."},{name:"Dueling",optionDescription:"When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon."},{name:"Two-Weapon Fighting",optionDescription:"When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack."}],numPicks:1},source:"ranger"},da={name:"Spellcasting",description:`
		You have learned to cast ranger spells using Wisdom as your spellcasting ability. 
		At level 3, you know three 1st-level spells and have two 1st-level spell slots.
	`,source:"ranger"},ma={name:"Ranger Archetype",description:"Choose a Ranger Archetype at 3rd level.",featureOptions:{placeholderText:"-Choose an Archetype-",options:[{name:"Hunter",optionDescription:`
					You focus on the art of hunting and gain abilities that improve your combat effectiveness.
				`,nestedPrompts:[{name:"Hunter’s Prey",description:"Choose one of the following options:",featureOptions:{placeholderText:"-Choose an Option-",options:[{name:"Colossus Slayer",optionDescription:"Extra 1d8 damage once per turn to creatures below their max HP."},{name:"Giant Killer",optionDescription:"When a Large or larger creature attacks you, you can use your reaction to attack it immediately."},{name:"Horde Breaker",optionDescription:"Once per turn, you can make an additional attack against a different creature within 5 feet of the original target."}],numPicks:1},source:"ranger.hunter"}]},{name:"Beast Master",optionDescription:`
					You gain a beast companion to fight alongside you.
				`,nestedPrompts:[{name:"Ranger’s Companion",description:`
							You gain a beast companion that accompanies you on adventures and battles.
						`,source:"ranger.beast_master"}]}],numPicks:1},source:"ranger"},ha=[ua,da,ma],ga={name:"Ranger",image:_+"/class_icons/ranger.jpg",description:"Skilled hunters and trackers, masters of nature and survival.",hitDie:"d10",primaryAbility:"Dexterity & Wisdom",saves:["Strength","Dexterity"],armorProficiencies:["Light Armor","Medium Armor","Shields"],weaponProficiencies:["Simple Weapons","Martial Weapons"],classFeatures:[pa,...ha]},fa={name:"Skill Proficiencies",description:`
		Armor: Light armor <br>
		Weapons: Simple weapons, hand crossbows, longswords, rapiers, shortswords <br>
		Saving Throws: Dexterity, Intelligence <br>
		Skills: Choose four from Acrobatics, Athletics, Deception, Insight, Intimidation, Investigation, Perception, Performance, Persuasion, Sleight of Hand, Stealth
	`,featureOptions:{placeholderText:"Select skills",options:["Acrobatics","Athletics","Deception","Insight","Intimidation","Investigation","Perception","Performance","Persuasion","Sleight of Hand","Stealth"],numPicks:4},source:"rogue.proficiencies"},ya={name:"Sneak Attack",description:`
		Beginning at 1st level, you know how to strike subtly and exploit a foe’s distraction. 
		Once per turn, you can deal an extra 2d6 damage to one creature you hit with an attack if you have advantage on the attack roll. 
		The attack must use a finesse or a ranged weapon.
	`,source:"rogue"},va={name:"Cunning Action",description:`
		Starting at 2nd level, your quick thinking and agility allow you to move and act quickly. 
		You can take a bonus action on each of your turns in combat to Dash, Disengage, or Hide.
	`,source:"rogue"},wa={name:"Roguish Archetype",description:"Choose a Roguish Archetype at 3rd level.",featureOptions:{placeholderText:"-Choose an Archetype-",options:[{name:"Thief",optionDescription:`
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
						`,source:"rogue.arcane_trickster"}]}],numPicks:1},source:"rogue"},ba=[ya,va],ka={name:"Rogue",image:_+"/class_icons/rogue.jpg",description:"Sneaky and dexterous masters of stealth and trickery.",hitDie:"d8",primaryAbility:"Dexterity",saves:["Dexterity","Intelligence"],armorProficiencies:["Light Armor"],weaponProficiencies:["Simple Weapons","Hand Crossbows","Longswords","Rapiers","Shortswords"],classFeatures:[fa,...ba,wa]},Pa={name:"Skill Proficiencies",description:`
		Armor: None <br>
		Weapons: Daggers, darts, slings, quarterstaffs, light crossbows <br>
		Saving Throws: Constitution, Charisma <br>
		Skills: Choose two from Arcana, Deception, Insight, Intimidation, Persuasion, and Religion
	`,featureOptions:{placeholderText:"Select skills",options:["Arcana","Deception","Insight","Intimidation","Persuasion","Religion"],numPicks:2},source:"sorcerer.proficiencies"},Sa={name:"Spellcasting",description:`
		You know four cantrips of your choice from the sorcerer spell list. 
		You know two 1st-level spells of your choice.
		You can cast spells using Charisma as your spellcasting ability.
	`,source:"sorcerer"},_a={name:"Sorcery Points",description:`
		Starting at 2nd level, you can use sorcery points to fuel your metamagic. 
		You have a number of sorcery points equal to your sorcerer level (3).
		You regain all expended sorcery points when you finish a long rest.
	`,source:"sorcerer"},Aa={name:"Metamagic",description:"Choose two Metamagic options to customize your spells.",featureOptions:{placeholderText:"-Choose Metamagic-",options:[{name:"Careful Spell",optionDescription:"When you cast a spell that forces other creatures to make a saving throw, you can protect some of those creatures from the effect."},{name:"Distant Spell",optionDescription:"When you cast a spell with a range of 5 feet or greater, you can double the range."},{name:"Empowered Spell",optionDescription:"When you roll damage for a spell, you can reroll a number of damage dice up to your Charisma modifier."},{name:"Extended Spell",optionDescription:"When you cast a spell with a duration of 1 minute or longer, you can double the duration."},{name:"Heightened Spell",optionDescription:"You can give one target of a spell disadvantage on its first saving throw made against the spell."},{name:"Quickened Spell",optionDescription:"You can cast a spell that has a casting time of 1 action as a bonus action instead."},{name:"Subtle Spell",optionDescription:"You can cast a spell without any somatic or verbal components."},{name:"Twinned Spell",optionDescription:"When you cast a spell that targets only one creature and doesn’t have a range of self, you can target a second creature."}],numPicks:2},source:"sorcerer"},Da={name:"Sorcerous Origin",description:"Choose your Sorcerous Origin at 1st level.",featureOptions:{placeholderText:"-Choose an Origin-",options:[{name:"Draconic Bloodline",optionDescription:`
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
						`,source:"sorcerer.wild_magic"}]}],numPicks:1},source:"sorcerer"},Ca=[Sa,_a,Aa],Wa={name:"Sorcerer",image:_+"/class_icons/sorcerer.jpg",description:"Spellcasters who draw power from innate magical bloodlines or forces.",hitDie:"d6",primaryAbility:"Charisma",saves:["Constitution","Charisma"],armorProficiencies:[],weaponProficiencies:["Daggers","Darts","Slings","Quarterstaffs","Light Crossbows"],classFeatures:[Pa,...Ca,Da]},Ya={name:"Skill Proficiencies",description:`
		Armor: Light armor <br>
		Weapons: Simple weapons <br>
		Saving Throws: Wisdom, Charisma <br>
		Skills: Choose two from Arcana, Deception, History, Intimidation, Investigation, Nature, and Religion
	`,featureOptions:{placeholderText:"Select skills",options:["Arcana","Deception","History","Intimidation","Investigation","Nature","Religion"],numPicks:2},source:"warlock.proficiencies"},Ta={name:"Otherworldly Patron",description:"Choose your Otherworldly Patron at 1st level.",featureOptions:{placeholderText:"-Choose a Patron-",options:[{name:"The Archfey",optionDescription:`
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
						`,source:"warlock.great_old_one"}]}],numPicks:1},source:"warlock"},xa={name:"Pact Magic",description:`
		You know two cantrips of your choice from the warlock spell list.
		You know two 1st-level spells.
		You regain spell slots on a short or long rest.
		You use Charisma as your spellcasting ability.
	`,source:"warlock"},Oa={name:"Eldritch Invocations",description:`
		At 2nd level, you gain two eldritch invocations of your choice.
		These grant you various magical abilities.
	`,source:"warlock",featureOptions:{placeholderText:"Select two Invocations",options:["Agonizing Blast","Armor of Shadows","Beast Speech","Beguiling Influence","Devil’s Sight","Eldritch Sight","Fiendish Vigor","Mask of Many Faces"],numPicks:2}},Ia=[xa,Oa],Ma={name:"Warlock",image:_+"/class_icons/warlock.jpg",description:"A wielder of magic granted by a pact with an otherworldly being.",hitDie:"d8",primaryAbility:"Charisma",saves:["Wisdom","Charisma"],armorProficiencies:["Light Armor"],weaponProficiencies:["Simple Weapons"],classFeatures:[Ya,...Ia,Ta]},Ha={name:"Skill Proficiencies",description:`
		Weapons: Daggers, darts, slings, quarterstaffs, light crossbows <br>
		Saving Throws: Intelligence, Wisdom <br>
		Skills: Choose two from Arcana, History, Insight, Investigation, Medicine, and Religion
	`,featureOptions:{placeholderText:"Select skills",options:["Arcana","History","Insight","Investigation","Medicine","Religion"],numPicks:2},source:"wizard.proficiencies"},Fa={name:"Arcane Recovery",description:`
		Once per day when you finish a short rest, you can recover expended spell slots with a combined level equal to or less than half your wizard level (rounded up).
	`,source:"wizard"},Ra={name:"Spellcasting",description:`
		You know three cantrips from the wizard spell list.
		You know six 1st-level wizard spells.
		You prepare spells from your spellbook, using Intelligence as your spellcasting ability.
	`,source:"wizard"},$a={name:"Arcane Tradition",description:"Choose an Arcane Tradition at 2nd level.",featureOptions:{placeholderText:"-Choose an Arcane Tradition-",options:[{name:"School of Evocation",optionDescription:`
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
						`,source:"wizard.illusion"}]}],numPicks:1},source:"wizard"},Ba=[Fa,Ra,$a],La={name:"Wizard",image:_+"/class_icons/wizard.jpg",description:"Scholars of magic who manipulate arcane forces through study and practice.",hitDie:"d6",primaryAbility:"Intelligence",saves:["Intelligence","Wisdom"],armorProficiencies:[],weaponProficiencies:["Daggers","Darts","Slings","Quarterstaffs","Light Crossbows"],classFeatures:[Ha,...Ba]};var za=k('<button class="class-card svelte-1nmt2r9"><div class="card-left svelte-1nmt2r9"><img class="svelte-1nmt2r9"/> <span> </span></div> <img class="card-arrow svelte-1nmt2r9" alt="next arrow"/></button>'),Na=k('<div class="class-cards svelte-1nmt2r9"></div>'),qa=k('<div class="feature-card svelte-1nmt2r9"><h4> </h4> <p><!></p></div>'),ja=k('<div class="popup svelte-1nmt2r9"><div class="popup-content svelte-1nmt2r9"><div class="popup-header svelte-1nmt2r9"><span>CONFIRM ADD CLASS</span> <button class="close-button svelte-1nmt2r9">×</button></div> <div class="popup-body svelte-1nmt2r9"><h2> </h2> <p class="description svelte-1nmt2r9"> </p> <p><strong>Primary Ability:</strong> </p> <!></div> <div class="popup-footer svelte-1nmt2r9"><button class="cancel-button svelte-1nmt2r9">Cancel</button> <button class="add-button svelte-1nmt2r9">Add Class</button></div></div></div>'),Ea=k("<option> </option>"),Ua=k('<select class="svelte-1nmt2r9"><option disabled> </option><!></select>'),Qa=k("<option> </option>"),Va=k('<select class="svelte-1nmt2r9"><option disabled> </option><!></select>'),Ga=k('<div class="feature-card nested svelte-1nmt2r9"><h4> </h4> <p><!></p> <!></div>'),Ka=k("<!> <!>",1),Ja=k("<p><!></p> <!>",1),Xa=k('<div class="feature-card svelte-1nmt2r9"><button class="feature-header svelte-1nmt2r9" type="button"><span class="feature-name svelte-1nmt2r9"> </span> <span class="expand-indicator svelte-1nmt2r9"> </span></button> <!></div>'),Za=k('<div class="selected-class-card svelte-1nmt2r9"><div class="selected-class-info svelte-1nmt2r9"><img class="selected-class-icon svelte-1nmt2r9"/> <div class="selected-class-text svelte-1nmt2r9"><h2 class="svelte-1nmt2r9"> </h2> <p class="max-hp svelte-1nmt2r9"> </p></div> <button class="remove-class-button svelte-1nmt2r9" aria-label="Remove selected class">✕</button></div> <!></div>'),et=k(`<div class="main-content svelte-1nmt2r9"><p class="intro-text svelte-1nmt2r9">In Dungeons & Dragons, your character's class determines what they can do. 
		It marks what role your character will play in your party of adventurers. 
        Each class has strengths and weaknesses, so its important to use teamwork!</p> <!> <!> <!></div>`);function ut(y,A){po(A,!1);const M=re(),C=[bo,Wo,Mo,Lo,Qo,ea,la,ga,ka,Wa,Ma,La];let d=re(null),m=re(null),r=re({}),g=re(new Set);function W(t){e(g).has(t)?e(g).delete(t):e(g).add(t),S(g,new Set(e(g)))}function G(t,l,p){e(r)[t.name]||Me(r,e(r)[t.name]=Array(t.featureOptions?.numPicks||1).fill(null));const n=e(r)[t.name][l];Me(r,e(r)[t.name][l]=p),n!==p&&L(t,e(r))}function L(t,l){if(t.featureOptions){for(const p of t.featureOptions.options)if(typeof p!="string"&&p.nestedPrompts)for(const n of p.nestedPrompts)delete l[n.name]}}function x(t,l){const p=t.featureOptions?.options||[],n=e(r)[t.name]||[];return p.filter(f=>{const P=typeof f=="string"?f:f.name;return!n.some((Y,O)=>Y===P&&O!==l)})}function Re(t,l){if(!t.featureOptions)return[];const p=[];for(const n of t.featureOptions.options){const f=typeof n=="string"?n:n.name;l.includes(f)&&typeof n!="string"&&n.nestedPrompts&&p.push(...n.nestedPrompts)}return p}function $e(){S(m,null),S(d,null),S(r,{}),S(g,new Set)}function Be(){e(d)&&(S(m,e(d)),S(d,null),S(r,{}),S(g,new Set))}function Le(t){if(!t)return"N/A";const l=t.match(/d(\d+)/);if(!l)return"N/A";const p=parseInt(l[1],10),n=Math.floor(p/2)+1;return p+n*2}uo(()=>e(m),()=>{S(M,e(m)?[...e(m).classFeatures||[]]:[])}),mo(),fo();var me=et(),_e=c(i(me),2);{var ze=t=>{var l=Na();B(l,5,()=>C,V,(p,n)=>{var f=za(),P=i(f),Y=i(P),O=c(Y,2),z=i(O,!0);a(O),a(P);var K=c(P,2);a(f),T(()=>{se(Y,"src",(e(n),o(()=>e(n).image))),se(Y,"alt",(e(n),o(()=>`${e(n).name} icon`))),b(z,(e(n),o(()=>e(n).name))),se(K,"src",`${_??""}/basic_icons/blue_next.png`)}),$("click",f,()=>S(d,e(n))),v(p,f)}),a(l),v(t,l)};Q(_e,t=>{e(m)||t(ze)})}var Ae=c(_e,2);{var Ne=t=>{var l=ja(),p=i(l),n=i(p),f=c(i(n),2);a(n);var P=c(n,2),Y=i(P),O=i(Y,!0);a(Y);var z=c(Y,2),K=i(z,!0);a(z);var J=c(z,2),N=c(i(J));a(J);var s=c(J,2);B(s,1,()=>(e(d),o(()=>e(d).classFeatures)),V,(he,j)=>{var Z=qa(),ee=i(Z),ge=i(ee,!0);a(ee);var H=c(ee,2),ce=i(H);Pe(ce,()=>(e(j),o(()=>e(j).description))),a(H),a(Z),T(()=>b(ge,(e(j),o(()=>e(j).name)))),v(he,Z)}),a(P);var U=c(P,2),q=i(U),X=c(q,2);a(U),a(p),a(l),T(()=>{b(O,(e(d),o(()=>e(d).name))),b(K,(e(d),o(()=>e(d).description))),b(N,` ${e(d),o(()=>e(d).primaryAbility)??""}`)}),$("click",f,()=>S(d,null)),$("click",q,()=>S(d,null)),$("click",X,Be),v(t,l)};Q(Ae,t=>{e(d)&&t(Ne)})}var qe=c(Ae,2);{var je=t=>{var l=Za(),p=i(l),n=i(p),f=c(n,2),P=i(f),Y=i(P,!0);a(P);var O=c(P,2),z=i(O);a(O),a(f);var K=c(f,2);a(p);var J=c(p,2);B(J,1,()=>e(M),N=>N.name,(N,s)=>{var U=Xa(),q=i(U),X=i(q),he=i(X,!0);a(X);var j=c(X,2),Z=i(j,!0);a(j),a(q);var ee=c(q,2);{var ge=H=>{var ce=Ja(),fe=ke(ce),Ee=i(fe);Pe(Ee,()=>(e(s),o(()=>e(s).description))),a(fe);var Ue=c(fe,2);{var Qe=ye=>{var De=Ka(),Ce=ke(De);B(Ce,1,()=>(e(s),o(()=>Array(e(s).featureOptions.numPicks))),V,(oe,u,I)=>{var D=Ua(),E=i(D),ae=i(E,!0);a(E),E.value=E.__value="";var ve=c(E);B(ve,1,()=>(e(s),o(()=>x(e(s),I))),V,(te,h)=>{var F=Ea(),we=i(F,!0);a(F);var pe={};T(()=>{b(we,(e(h),o(()=>typeof e(h)=="string"?e(h):e(h).name))),pe!==(pe=(e(h),o(()=>typeof e(h)=="string"?e(h):e(h).name)))&&(F.value=(F.__value=(e(h),o(()=>typeof e(h)=="string"?e(h):e(h).name)))??"")}),v(te,F)}),a(D);var le;He(D),T(()=>{b(ae,(e(s),o(()=>e(s).featureOptions.placeholderText||"Select an option"))),le!==(le=(e(r),e(s),o(()=>e(r)[e(s).name]?.[I]||"")))&&(D.value=(D.__value=(e(r),e(s),o(()=>e(r)[e(s).name]?.[I]||"")))??"",Se(D,(e(r),e(s),o(()=>e(r)[e(s).name]?.[I]||""))))}),$("change",D,te=>{const h=te.target;G(e(s),I,h.value)}),v(oe,D)});var Ve=c(Ce,2);B(Ve,1,()=>(e(s),e(r),o(()=>Re(e(s),e(r)[e(s).name]||[]))),oe=>oe.name,(oe,u)=>{var I=Ga(),D=i(I),E=i(D,!0);a(D);var ae=c(D,2),ve=i(ae);Pe(ve,()=>(e(u),o(()=>e(u).description))),a(ae);var le=c(ae,2);{var te=h=>{var F=go(),we=ke(F);B(we,1,()=>(e(u),o(()=>Array(e(u).featureOptions.numPicks))),V,(pe,ot,ue)=>{var R=Va(),ie=i(R),Ge=i(ie,!0);a(ie),ie.value=ie.__value="";var Ke=c(ie);B(Ke,1,()=>(e(u),o(()=>e(u).featureOptions.options)),V,(be,w)=>{var ne=Qa(),Je=i(ne,!0);a(ne);var Ye={};T(()=>{b(Je,(e(w),o(()=>typeof e(w)=="string"?e(w):e(w).name))),Ye!==(Ye=(e(w),o(()=>typeof e(w)=="string"?e(w):e(w).name)))&&(ne.value=(ne.__value=(e(w),o(()=>typeof e(w)=="string"?e(w):e(w).name)))??"")}),v(be,ne)}),a(R);var We;He(R),T(()=>{b(Ge,(e(u),o(()=>e(u).featureOptions.placeholderText||"Select an option"))),We!==(We=(e(r),e(u),o(()=>e(r)[e(u).name]?.[ue]||"")))&&(R.value=(R.__value=(e(r),e(u),o(()=>e(r)[e(u).name]?.[ue]||"")))??"",Se(R,(e(r),e(u),o(()=>e(r)[e(u).name]?.[ue]||""))))}),$("change",R,be=>{const w=be.target;G(e(u),ue,w.value)}),v(pe,R)}),v(h,F)};Q(le,h=>{e(u),o(()=>e(u).featureOptions)&&h(te)})}a(I),T(()=>b(E,(e(u),o(()=>e(u).name)))),v(oe,I)}),v(ye,De)};Q(Ue,ye=>{e(s),o(()=>e(s).featureOptions)&&ye(Qe)})}v(H,ce)};Q(ee,H=>{e(g),e(s),o(()=>e(g).has(e(s).name))&&H(ge)})}a(U),T(H=>{b(he,(e(s),o(()=>e(s).name))),b(Z,H)},[()=>(e(g),e(s),o(()=>e(g).has(e(s).name)?"–":"+"))]),$("click",q,()=>W(e(s).name)),v(N,U)}),a(l),T(N=>{se(n,"src",(e(m),o(()=>e(m).image))),se(n,"alt",(e(m),o(()=>`${e(m).name} icon`))),b(Y,(e(m),o(()=>e(m).name))),b(z,`Average Health: ${N??""}`)},[()=>(e(m),o(()=>Le(e(m).hitDie)))]),$("click",K,$e),v(t,l)};Q(qe,t=>{e(m)&&t(je)})}a(me),v(y,me),ho()}export{ut as component};

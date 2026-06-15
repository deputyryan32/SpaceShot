namespace SpriteKind{
    export const Fuel = SpriteKind.create();
    export const Boss = SpriteKind.create();
    export const PowerUp = SpriteKind.create();
    export const PowerUpIndicator = SpriteKind.create();
    export const BossLaser = SpriteKind.create();
};

namespace StatusBarKind{
    export const Fuel = StatusBarKind.create();
    export const BossHealth = StatusBarKind.create();
    export const ARMHealth = StatusBarKind.create();
};

// Start Screen Effects
effects.starField.startScreenEffect();

// Set Background Color
scene.setBackgroundImage(assets.image`myImage`)
scroller.scrollBackgroundWithSpeed(0, 10, 1)
// Player Setup
// Player Sprite Create (Changed swordFish to playerShip)
let playerShip = sprites.create(assets.image`playerShip`, SpriteKind.Player);

// Setting Player Inital Posision
playerShip.setPosition(80, 90);

// Player Speed Var (Changed fishSpeed to shipSpeed) (Page Line: 38)
let shipSpeed = 100;

// Intro
playerShip.sayText("Welcome to SpaceShot!", 1000)
pause(1000)
playerShip.sayText("Move with the JoyCon or WASD!", 1000)
pause(1000)
playerShip.sayText("Shoot with A", 1000)
pause(1000)
playerShip.sayText("Dodge with B!", 1000)
pause(1000)
playerShip.sayText("Your bottem bar is your fuel level!", 1000)
pause(1000)
playerShip.sayText("Good Luck!", 1000)
pause(1000)
// Connect Controls to playerShip to shipSpeed (Page Line: 39)
controller.moveSprite(playerShip, shipSpeed);

// Lock player on Screen (Page Line: 42)
playerShip.setFlag(SpriteFlag.StayInScreen, true);

// Establish and Attach Player Fuel Bar (Page Line: 51)
let playerFuelBar = statusbars.create(20, 4, StatusBarKind.Fuel)

// Attach Bar to player (Page Line: 53)
playerFuelBar.attachToSprite(playerShip, -15, -0.1);

// Set Max Val (Page Line: 55)
playerFuelBar.max = 100;

// Set Starting Vaule (Page Line: 57)
playerFuelBar.value = 100;

// Setting color to aling with fuel refill (Page Line: 59)
playerFuelBar.setColor(2, 6);

// Player looses 1% of fuel every .8 Seconds (Page Line: 64)
game.onUpdateInterval(800, function(){
    playerFuelBar.value += -1;
});


// Setting Game Over Type (Page Line: 444)
game.setGameOverScoringType(game.ScoringType.HighScore)

// End Game Fuel System (Page Line: 88)
statusbars.onZero(StatusBarKind.Fuel, function(status){

    // Game Over
    game.over(false, effects.melt)
});

// Spawning The Refuel Sprite (Page Line: 70)
game.onUpdateInterval(5000, function(){
    // Using projectile from side allows us to easly set vx and vy values
    let fuelRefill = sprites.createProjectileFromSide(assets.image`fuel`, 0, 50)

    // Adjusting the x value of fuelRefill to it is randomised with a buffer
    fuelRefill.x = randint(5, 155)

    // Setting the fuelRefills kind
    fuelRefill.setKind(SpriteKind.Fuel)
});

// Overlap Code for Reful (Page Line: 82)
sprites.onOverlap(SpriteKind.Player, SpriteKind.Fuel, function(sprite, fuel){
    playerFuelBar.value = playerFuelBar.max;
    info.changeScoreBy(+1) // Changed to make points be given 
    fuel.destroy();
});

// Enemy Establishment (Page Line: 91)
let enemyShip: Sprite = null;

// Array Creation for Ememy Sprite Images (Page Line: 97)
let enemyShipImageList = [
    assets.image`enemyShip`,
    assets.image`enemyShip2`,
    assets.image`enemyShip3`,
    assets.image`enemyShip4`,
    assets.image`enemyShip5`
];

// Enemy Speed (Page Line: 100)
let enemySpeed = 35;

//Background animation
forever(function(){
    scroller.scrollBackgroundWithSpeed(0, enemySpeed, 1)
})

// Enemy Spawn (Page Line 102)
game.onUpdateInterval(randint(2000,3000), function(){
    enemyShip = sprites.create(enemyShipImageList._pickRandom(), SpriteKind.Enemy);
    enemyShip.y = 0;
    enemyShip.vy = enemySpeed;
    enemyShip.x = randint (5, 155);
    enemyShip.setFlag(SpriteFlag.AutoDestroy, true);
});


// loseLifeReset function (Page Line: 421) (Returned on Day 5)

function loseLifeReset(){
    // Reduse life count
    info.changeLifeBy(-1);

    // Clear All Enemys
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy);

    // Cam Shake
    scene.cameraShake(4, 500);

    // Reset Player POS
    playerShip.setPosition(80,90);

    // Reset Fuel Bar
    playerFuelBar.value = playerFuelBar.max;

    // Reset Laser Count
    laserUpgradeCount = 0;

    // Reset Enemy Count
    enemyCount = 0;

    // Reset Laser Level
    laserLevel = 0;

    // Reset Boss Spawn Level
    bossSpawnLevel = 1;

    // Reset Boss Spawn Count
    bossSpawnNum = 0;
};
// Plauer and Enemy Overlap (Page Line: 110)
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function(sprite, enemy){
    loseLifeReset();
});

// onLifeZero (Page Line: 443)
info.onLifeZero(function(){
    game.setGameOverEffect(true, effects.melt);
    game.gameOver(true);
});

// Creation of Lasers
let laser: Sprite = null;

// Create An Array for Laser enemyShipImageList
let laserList = [
    assets.image`lazerOne`,
    assets.image`lazerOne2`,
    assets.image`lazerOne3`,
    assets.image`lazerOne4`
]

// Establish Laser Level
let laserLevel = 0;

// (Page Line: 441)
controller.A.onEvent(ControllerButtonEvent.Pressed, function(){
    playerShip.sayText("PEW!", 100)
    music.play(music.melodyPlayable(music.pewPew), music.PlaybackMode.InBackground);
    if (doubleFire && doubleFire.lifespan > 0){
        playerShip.sayText("DOUBLE PEW!", 100)
        laser = sprites.createProjectileFromSprite(laserList[laserLevel], playerShip, 0, -100)
        laser.x += -3;
        laser.y += 1;
        laser = sprites.createProjectileFromSprite(laserList[laserLevel], playerShip, 0, -100)
        laser.x += 3;
        laser.y += 1;
    } else {


        // Creae a Var for picking The Laser side
        let laserSide = randint(1,2);
        if (laserSide == 2){
            laser = sprites.createProjectileFromSprite(laserList[laserLevel], playerShip, 0, -100)
            laser.x += 3;
            laser.y += 1;
        } else {  
            laser = sprites.createProjectileFromSprite(laserList[laserLevel], playerShip, 0, -100)
            laser.x += -3;
            laser.y += 1;
    }
    if (scaleUp && scaleUp.lifespan > 0) {
        playerShip.sayText("DOUBLE PEW!", 100)
        scaling.scaleByPixels(laser, 10, ScaleDirection.Uniformly, ScaleAnchor.Middle)
    }
    }
});

// enemyCount to keep track of enemys dedtroyed (Page Line: 158)
let enemyCount = 0;

// Var to keep track of laser upgrade counts. (Page Line: 162)
let laserUpgradeCount = 0;

// When a laser hits a enemy (Page Line: 165)
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (laser, enemy){
    sprites.destroy(laser);
    sprites.destroy(enemy, effects.fire, 100);
    info.changeScoreBy(1);
    enemyCount += 1;
    laserUpgradeCount += 1;
})

// Creating Laser Upgrade System (Page Line Area: 176)

let laserUpgradeList = [
    assets.image`laserUp`,
    assets.image`scaleLaser`,
    assets.image`doubleLaser`
];

// Creating the space for the laserUpgrade Sprite
let laserUpgrade: Sprite = null;

// Create Sprite Space for DF and SU Indicators (Page Line: 190)
let doubleFire: Sprite = null;
let scaleUp: Sprite = null;

// Spawning Code for Laser Upgrade (Page Line: 194)
game.onUpdateInterval(5500, function(){
    // Chel if laserUpgradeCountis greater than 5
    if(laserUpgradeCount >= 5){
        // Reset Laser Count
        laserUpgradeCount = 0;

        // Randomise the PowerUp from 0 - 2
        let randLaserValue = randint(0,2);
        // Establigh laserUpgrade Sprite with rand laser value
        laserUpgrade = sprites.create(laserUpgradeList[randLaserValue], SpriteKind.PowerUp);
        laserUpgrade.setPosition(randint(5,145),0);
        playerShip.sayText("POWER UP!", 250)
        laserUpgrade.vy = enemySpeed;
        // Setting lasers Upgrade Additional Data Type for easier comerison.
        sprites.setDataNumber(laserUpgrade, "type", randLaserValue);
    }
});

// Create a function to handle the esablighment of varisus powerups (From Page LineL 206-244)
function powerUpStart(sprite: Sprite){
        // Remove PowerUp sprite
        sprites.destroy(sprite, effects.coolRadial, 50);
        // Reward player based on laserLevel
        info.changeScoreBy(laserLevel);
        // Setting up Major Logic System for PowerUp
        if (sprites.readDataNumber(sprite, "type") == 0){
        // Setting the max laser level to 4
        if (laserLevel >= 3){
            laserLevel = 3;
        } else{
            laserLevel += 1;
        }
    } else if (sprites.readDataNumber(sprite, "type") == 1) {
        // Create Ind sprite
        scaleUp = sprites.create(laserUpgradeList[1], SpriteKind.PowerUpIndicator);
        scaleUp.setPosition(10, 110);
        scaleUp.lifespan = (laserLevel * 1000) + 4000;
    } else if (sprites.readDataNumber(sprite, "type") == 2){
        doubleFire = sprites.create(laserUpgradeList[2], SpriteKind.PowerUpIndicator);
        doubleFire.setPosition(10, 100);
        doubleFire.lifespan = (laserLevel * 1000) + 4000;
    }
}

sprites.onOverlap(SpriteKind.Player, SpriteKind.PowerUp, function(sprite, powerUp){
    powerUpStart(powerUp)
});

// Boss
let bossShip: Sprite = null
let bossSpawnLevel = 1;
let bossSpawnNum = 0;
let bossHealthBar: StatusBarSprite = null;
let bossHealth = 10;
forever(function(){
    if (bossSpawnNum <= 0 && enemyCount >= 8){ // Was 10
        if (!armHealthFull){
            allRangeMode();
        } else{
        
            for (let bl = 0; bl < bossSpawnLevel; bl++){
                playerShip.sayText("Oh NO! A BOSS! Dodge N Weave to survive!", 1500)
                pause(1500)
                bossShip = sprites.create(assets.image`Boss`, SpriteKind.Boss);
                bossShip.setPosition(randint(5,155), 0);
                bossSpawnNum += 1;
                bossShip.vx = enemySpeed;
                bossShip.vy = 50;
                bossShip.setBounceOnWall(true);
                bossHealthBar = statusbars.create(20,4, StatusBarKind.BossHealth);
                bossHealthBar.attachToSprite(bossShip);
                bossHealthBar.setColor(2, 8, 5);
                bossHealthBar.max = bossHealth;
                bossHealthBar.value = bossHealthBar.max;
                pause(750);
                bossShip.vy = 0;
                pause(1250);
            }
        }    
    }
})

sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Boss, function (laser, boss){
    sprites.destroy(laser, effects.fire, 30);
    statusbars.getStatusBarAttachedTo(StatusBarKind.BossHealth, boss).value += -1;
})

//Destroy Boss when boss health is 0
statusbars.onZero(StatusBarKind.BossHealth, function(status){
    sprites.destroy(status.spriteAttachedTo(), effects.fire, 100);
    bossSpawnNum += -1
    info.setScore(+5)
    info.changeScoreBy(armHealthBar.value);
    enemyCount = 0;
    if (bossSpawnNum <= 0){
        bossSpawnLevel += 1;
        sprites.destroy(armHealthBar);
        // Update ARM Health Status
        armHealthFull = false;
    }
    if (enemySpeed >= 120){
        enemySpeed = 120;
    } else{
        enemySpeed += (5 * bossSpawnLevel)
    }
})


// Boss Weapon System
let bossLaserL: Sprite = null;
let bossLaserR: Sprite = null;

// Create An Array for Laser enemyShipImageList
let bossList = [
    assets.image`bossLazer1`,
    assets.image`bossLazer2`
]


game.onUpdateInterval(randint(1500,2000), function(){
    // Only run with boss on Screen
    if (bossSpawnNum > 0){
        let fireingBossShip = sprites.allOfKind(SpriteKind.Boss)._pickRandom();
        bossLaserL = sprites.createProjectileFromSprite(bossList[laserLevel].clone(), fireingBossShip, 0, 120);
        bossLaserL.setKind(SpriteKind.BossLaser);
        bossLaserL.image.replace(9, 4)
        bossLaserL.x += -6;
        bossLaserL.y += 6;
        bossLaserL = sprites.createProjectileFromSprite(bossList[laserLevel].clone(), fireingBossShip, 0, 120);
        bossLaserL.setKind(SpriteKind.BossLaser);
        bossLaserL.image.replace(9, 4)
        bossLaserL.x += 6;
        bossLaserL.y += 6;
    }
})

// Boss Lasers Setup/Outcome
// Establish All Range Mode (ARM)
// Set ARM Health
let armHealth = 8;

// Setting ARM State 
let armHealthFull = false;
// ARM Health Status Background
let armHealthBar: StatusBarSprite = null;

// Creating Custom function
function allRangeMode(){
    // ARM Health Status Bar Sprite
    armHealthBar = statusbars.create(4,20, StatusBarKind.ARMHealth);
    // Attach Bar to Sprite
    armHealthBar.attachToSprite(playerShip, 5, 0);
    // Setting ARM Health Max
    armHealthBar.max = armHealth;
    // Settin ARmBar Colors
    armHealthBar.setColor(8,3,5);
    // Set Inital Value of ArmBar 1
    armHealthBar.value = 1;
    //Creation of fill animation
    for (let v = armHealthBar.value; v < armHealthBar.max; v++){
        armHealthBar.value += 1;
        pause(200);
    };
    // Updating ARM Health Value
    armHealthFull = true;
};

// Boss laser Overlaps Player
sprites.onOverlap(SpriteKind.Player, SpriteKind.BossLaser, function (sprite, blaser){
    // Destroy Boss lasers
    sprites.destroy(blaser, effects.fire, 100);
    // Lower ARM Health Using IF Statement
    if (armHealthBar){
        statusbars.getStatusBarAttachedTo(StatusBarKind.ARMHealth, sprite).value += -2;
    };
});

// When ARM = 0
statusbars.onZero(StatusBarKind.ARMHealth, function(stauts){
    loseLifeReset();
    // Destroy All Bosses
    sprites.destroyAllSpritesOfKind(SpriteKind.Boss);
    // Destroy All Boss lasers
    sprites.destroyAllSpritesOfKind(SpriteKind.BossLaser);
    sprites.destroy(armHealthBar);
    // Reset armHealthFull value
    armHealthFull = false;
    // Use Lose Life Reset function
});


// [New] If laser hits fuel it goes away and speed goes up.
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Fuel, function (laser, fuel) {
    animation.runImageAnimation(fuel, assets.animation`fuel_exp`, 100, false)
    sprites.destroy(fuel, effects.fire, 200);
    enemySpeed += 5;
});

// [New] If a enemy leaves the screen then you loose 1 point.
sprites.onDestroyed(SpriteKind.Enemy, function(sprite: Sprite) {
    if (sprite.y >= 120){
        info.changeScoreBy(-1);
        playerShip.sayText("They got by me :(", 750);
    };
});

// [New] If a enemy hits a gas can then you loose 3 points, the gas can goes away and game speed goes up.
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Fuel, function (enemy, fuel){
    sprites.destroy(fuel);
    info.changeScoreBy(-3);
    enemySpeed += 5;
});

// [New] As game is happening speed goes up slowly.
game.onUpdateInterval(50000, function(){
    playerShip.sayText("SPEED UP!", 350)
    if (enemySpeed >= 120){
        enemySpeed += 1;
    } else {
        enemySpeed == 120;
    };
});

// [New] Every 80sec gives you 1 life.
game.onUpdateInterval(80000, function(){
    playerShip.sayText("New Life!", 250)
    if (info.life() >= 3){
        info.changeLifeBy(+0);
    } else {
        info.changeLifeBy(+1);
    };
});

// [New] If player presses the B button then they dodge
controller.B.onEvent(ControllerButtonEvent.Pressed, function(){
    playerShip.sayText("DODGE!", 250)
    if (playerShip.x > 81){
        playerShip.vx = 450
    } else {
        playerShip.vx = -450
    }
    
});

// [New] If player colides with boss then end Game
sprites.onOverlap(SpriteKind.Player, SpriteKind.Boss, function(sprite, boss){
    info.setLife(0)
});
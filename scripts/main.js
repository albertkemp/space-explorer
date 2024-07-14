// all fancy stuff in here or other js files
// $(document).ready(function(){
// const $briefing = $("#briefing");
// var remove = function(){
//     $briefing.remove();
// }
// $("#close").click(remove);
// });
$(document).ready(function(){
    
    function isTouching($elem1, $elem2) {
        var rect1 = $elem1[0].getBoundingClientRect();
        var rect2 = $elem2[0].getBoundingClientRect();
    
        return !(rect1.right < rect2.left || 
                 rect1.left > rect2.right || 
                 rect1.bottom < rect2.top || 
                 rect1.top > rect2.bottom);
    }
    const $rocket = $("#rocket");
    const $background = $("#background");
    const $fuel = $("#fuel");
    const $message = $("#message");
    const $close = $("#close");
    const $map = $("#map");
    const $mapbutton = $("#mapbutton");
    const $maprocket = $("#map-rocket");
    const $mapplanet1 = $("#map-planet1");
    const $maptinyplanet = $("#map-tinyplanet");
    const $mapchinaplanet = $("#map-chinaplanet");
    const $planet1 = $("#planet1");
    const $tinyplanet = $("#tinyplanet");
    const $mapotherplanet = $("#map-otherplanet");
    const $mapspider = $("#map-spider");
    const $mapplanet2 = $("#map-planet2");
    const $mapsatellite = $("#map-satellite");
    const $mapspaceship = $("#map-spaceship");
    const $mapmaze = $("#map-maze");
    const $homebutton = $("#homebutton");
    const $xydisplay = $("#xydisplay");
    const $mapholeplanet = $("#map-holeplanet");
    function message(content){
        $message.css("display", "block");
        $message.html(content);
        setTimeout(function(){
            $message.css("display", "none");
        },4000);
    }
message("USE THE ARROW KEYS TO CONTROL DIRECTION AND THRUST. GOOD LUCK, PILOT!");

    let x = 10550; 
    let y =8000; 
    
    let oldX = x;
    let oldY = y;
    let rotation = 0;
    $xydisplay.innerHTML = "X: " +x+"<br>Y: " + y+"<br>rotation" + rotation;
    let oldRotation =rotation;
    $homebutton.click(function(){
        x= oldX;
        y=oldY;
        rotation=oldRotation;
        message("WELCOME BACK, PILOT!");
    });
    let dx = 0;
    let dy = 0;
    let speed = 0;
    let maxSpeed = 1.5;
    let acceleration = 0.05;
    let deceleration = 0.05;
    let friction = 0.95;
    
    let rotationSpeed = 2;
    let fuel = 100;
    let fuelBurnSpeed = 0.3;
    let keys = {};
    let rocketWidth = $rocket.width();
    let rocketHeight = $rocket.height();
    let rocketDiameter = Math.max(rocketWidth, rocketHeight);

    const $potato = $("<div id='potato'></div>");
    $potato.css({
        "top": "10000px",
        "left": "10000px",
        "height": "5px",
        "width": "5px",
        "background-color": "grey",
        "position": "absolute"
    });
    
   function isPointingAt($rocket, $planet) {
    // Calculate the angle between the rocket and the planet
    let angle = Math.atan2($planet.offset().top - $rocket.offset().top, $planet.offset().left - $rocket.offset().left) * 180 / Math.PI;

    // Check if the rocket is pointed towards the planet within a range of +/- 20 degrees
    return Math.abs(rotation - angle) < 20;  // Adjust the threshold as needed
}
function showMap(){
    $map.css("display", "block");
}
function closeMap(){
    $map.css("display", "none");

}
$mapbutton.click(showMap);
$close.click(closeMap);
    
 
    let planets = [
        {id: "#planet1", x: 9000, y: 8800, visible: true, gravity: 0.2, diameter: 2000},
        {id: "#tinyplanet", x: 10000, y: 7760, visible: true, gravity: 0.1, diameter: 250},
        {id: "#chinaplanet", x: 7000, y: 6500, visible: true, gravity:0.1, diameter: 2000},
        {id: "#planet2", x: 7000, y: 9000, visible: true, gravity: 0.2, diameter: 2000},
        {id: "#otherplanet", x: 11500, y: 9000, visible: true, gravity: 0.2, diameter: 2000},
        {id: "#spider", x: 11000, y: 10300, visible: true, gravity: 0.2, diameter: 800},
        {id: "#satellite", x: 110000, y: 9000, visible: true, gravity: 0.2, diameter: 250},
        {id: "#spaceship", x: 110000, y: 8000, visible: true, gravity: 0.2, diameter: 250},
        {id: "#maze", x: 10000, y: 10700, visible: true, gravity: 0.2, diameter: 2000},
        {id: "#holeplanet", x: 7600, y: 6500, visible: true, gravity: 0.2, diameter: 2000},
    ]; 
    let spinplanets = [
        {id: "#planet1", x: planets[0].x, y: planets[0].y, visible: planets[0].visible, gravity: planets[0].gravity, diameter: planets[0].diameter},
        {id: "#chinaplanet", x: planets[2].x, y: planets[2].y, visible: planets[2].visible, gravity: planets[2].gravity, diameter: planets[2].diameter},
        {id: "#planet2",x: planets[3].x, y: planets[3].y, visible: planets[3].visible, gravity: planets[3].gravity, diameter: planets[3].diameter},
        {id: "#otherplanet", x: planets[4].x, y: planets[4].y, visible: planets[4].visible, gravity: planets[4].gravity, diameter: planets[4].diameter},
    ];
    function isColliding($elem1, $elem2) {
        var rect1 = $elem1[0].getBoundingClientRect();
        var rect2 = $elem2[0].getBoundingClientRect();
    
        // Calculate the center of each element
        var elem1CenterX = rect1.left + rect1.width / 2;
        var elem1CenterY = rect1.top + rect1.height / 2;
        var elem2CenterX = rect2.left + rect2.width / 2;
        var elem2CenterY = rect2.top + rect2.height / 2;
    
        // Get the diameters of the elements from their respective IDs
        var elem1Diameter = parseFloat($elem1.css("width"));
        var elem2Diameter = parseFloat($elem2.css("width"));
    
        // Calculate the distance between the centers of the elements
        var distanceX = elem1CenterX - elem2CenterX;
        var distanceY = elem1CenterY - elem2CenterY;
        var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
        // Check if the distance is less than the sum of the radii
        return distance < (elem1Diameter / 2 + elem2Diameter / 2);
    }
    $mapholeplanet.css({
        "left": (planets[9].x/100) + "px",
        "top": (planets[9].y/100) + "px",
        "height": (planets[9].diameter/100) + "px",
        "width": (planets[9].diameter/100) + "px";
    })

    $mapmaze.css({
        "left": (planets[8].x/100) + "px",
        "top": (planets[8].y/100) + "px",
        "height": (planets[8].diameter/100) + "px",
        "width": (planets[8].diameter/100) + "px",
    });
    $mapplanet1.css({
        "left": (planets[0].x/100) + "px",
        "top": (planets[0].y/100) + "px",
        "height": (planets[0].diameter/100) + "px",
        "width": (planets[0].diameter/100) + "px",
    });
    $maptinyplanet.css({
        "left": (planets[1].x/100) + "px",
        "top": (planets[1].y/100) + "px",
        "height": (planets[1].diameter/100) + "px",
        "width": (planets[1].diameter/100) + "px",
    });
    $mapchinaplanet.css({
        "left": (planets[2].x/100) + "px",
        "top": (planets[2].y/100) + "px",
        "height": (planets[2].diameter/100) + "px",
        "width": (planets[2].diameter/100) + "px",
    });
    $mapplanet2.css({
        "left": (planets[3].x/100) + "px",
        "top": (planets[3].y/100) + "px",
        "height": (planets[3].diameter/100) + "px",
        "width": (planets[3].diameter/100) + "px",
    });
    $mapotherplanet.css({
        "left": (planets[4].x/100) + "px",
        "top": (planets[4].y/100) + "px",
        "height": (planets[4].diameter/100) + "px",
        "width": (planets[4].diameter/100) + "px",
    });
    $mapspider.css({
        "left": (planets[5].x/100) + "px",
        "top": (planets[5].y/100) + "px",
        "height": (planets[5].diameter/100) + "px",
        "width": (planets[5].diameter/100) + "px",
    });
    $mapsatellite.css({
        "left": (planets[6].x/100) + "px",
        "top": (planets[6].y/100) + "px",
        "height": (planets[6].diameter/100) + "px",
        "width": (planets[6].diameter/100) + "px",

    });
    $mapspaceship.css({
        "left": (planets[7].x/100) + "px",
        "top": (planets[7].y/100) + "px",
        "height": (planets[7].diameter/100) + "px",
        "width": (planets[7].diameter/100) + "px",
    });
    $(document).on("keydown", function(event){
        event.preventDefault();
        keys[event.which] = true;
    });

    $(document).on("keyup", function(event){
        $rocket.attr("class", "rocket-flying-engine-off");
        event.preventDefault();
        keys[event.which] = false;
    });

    function animate() {
        for (let planet of planets) {
            /* if (isColliding($rocket, $(planet.id))) {
                // Calculate the distance between the rocket and the planet's center
                let distanceX = x - planet.x;
                let distanceY = y - planet.y;
                let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
                // Calculate the minimum distance between the rocket and the planet's surface
                let minDistance = planet.diameter / 2 + rocketDiameter / 2;
        
                // If the rocket is too close to the planet, adjust its position and velocity
                if (distance < minDistance) {
                    // Calculate the penetration depth
                    let penetrationDepth = minDistance - distance;
        
                    // Normalize the collision vector
                    let collisionNormalX = distanceX / distance;
                    let collisionNormalY = distanceY / distance;
        
                    // Adjust the rocket's position to prevent it from going further than the surface
                    x += penetrationDepth * collisionNormalX;
                    y += penetrationDepth * collisionNormalY;
        
                    // Calculate the relative velocity between the rocket and the planet
                    let relativeVelocityX = dx;
                    let relativeVelocityY = dy;
        
                    // Calculate the relative velocity along the collision normal
                    let relativeVelocityNormal = relativeVelocityX * collisionNormalX + relativeVelocityY * collisionNormalY;
        
                    // If the rocket is moving towards the planet, apply collision response
                    if (relativeVelocityNormal < 0) {
                        // Calculate the impulse magnitude
                        let impulseMagnitude = -2 * relativeVelocityNormal;
        
                        // Apply impulse to the rocket's velocity
                        dx += impulseMagnitude * collisionNormalX;
                        dy += impulseMagnitude * collisionNormalY;
        
                        // Reduce the rocket's speed to simulate friction
                        speed *= friction;
                    }
                }
            } */
        }
        let nearestPlanet = planets[0];
        let minDistance = Infinity;

        for (let planet of spinplanets) {
            $(planet.id).css({
                "left": (planet.x - x + 550) + "px", 
                "top": (planet.y - y + 400) + "px" 
            });
        
            // Calculate the angle between the rocket and the planet
            let angle = Math.atan2(y - planet.y, x - planet.x) * 180 / Math.PI;
            if (isColliding($rocket, $(planet.id))) {
        if (y<planet.y){
            if (x>oldX){
                $(planet.id).css({
                    "rotate": - angle*4 + "deg"
                });
            } else if (x<oldX){
                $(planet.id).css({
                    "rotate": + angle*4 + "deg"
                });
            }else{
                $(planet.id).css({
                    "rotate": 0 + "deg"
                });
            }
        } else if (y>planet.y){
            if (x>oldX){
                $(planet.id).css({
                    "rotate": - angle*4 + "deg"
                });
            } else if (x<oldX){
                $(planet.id).css({
                    "rotate": + angle*4 + "deg"
                });
            }else{
                $(planet.id).css({
                    "rotate": 0 + "deg"
                });
            }
        }
    } 
            
        }
let angle = Math.atan2(y - nearestPlanet.y, x - nearestPlanet.x);
        
        if (keys[37]) {
            $rocket.toggleClass("rocket-turn-left");
            rotation -= rotationSpeed;
        }
        if (keys[38]) {
            $rocket.toggleClass("rocket-thrusting-forward");
            fuel -= fuelBurnSpeed;
            if (fuel < 0) { fuel = 0; }
          
    let newDx = dx + speed * Math.sin(rotation * Math.PI / 180);
    let newDy = dy - speed * Math.cos(rotation * Math.PI / 180);

   
    $rocket.css({left: '+=' + newDx, top: '-=' + newDy});

    

        dx = newDx;
        dy = newDy;


  
    $rocket.css({left: '-=' + newDx, top: '+=' + newDy});
        }
        if (keys[39]) {
            $rocket.toggleClass("rocket-turn-right");
            rotation += rotationSpeed;
        }
        if (keys[40]) {
            $rocket.toggleClass("rocket-thrusting-backward");
            fuel -= fuelBurnSpeed;
            if (fuel < 0) { fuel = 0; }
            dx -= speed * Math.sin(rotation * Math.PI / 180);
            dy += speed * Math.cos(rotation * Math.PI / 180);
        }

        if (Object.values(keys).some(Boolean) && speed < maxSpeed) {
            speed += acceleration;
        } else if (speed > 0) {
            speed -= deceleration;
        }

        x += dx;
        y += dy;
        dx *= friction;
        dy *= friction;

        $fuel.css("height", "calc("+fuel+"px + 10px)");
        if (fuel > 0) {
            $fuel.attr("class", "isFuel");
        } else {
            $fuel.attr("class", "noFuel");
        }

        $rocket.css({
            "transform": "rotate(" + rotation + "deg)",
        });

        $background.css({
            "background-position": (-x + 550) + "px " + (-y + 400) + "px",
        });
        

        /* $maprocket.css("left", x/100 + "px");
    $maprocket.css("top", y/100 + "px"); */
    $maprocket.css({
        "left": (x/100) + "px",
        "top": (y/100) + "px",
        "rotate": rotation + "deg"
    });

        for (let planet of planets) {
            $(planet.id).css({
                "left": (planet.x - x + 550) + "px", 
                "top": (planet.y - y + 400) + "px" 
            });
        }

        requestAnimationFrame(animate);
    }

    animate();
});

console.log("hi")

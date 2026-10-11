let main = document.querySelector(".main")
let mainPlayer = document.querySelector(".main-player")
const shootSound = document.querySelector(".shot-sound")

let mouseX;
let mouseY;

let playerX = 50
let playerY = 272

let minusX
let minusY

let angle

//!mouse kordinatini almaq
main.addEventListener("mousemove", (event) => {
    
    let rect = main.getBoundingClientRect()

    mouseX = event.clientX - rect.left
    mouseY = event.clientY - rect.top

    minusX = mouseX - playerX
    minusY = mouseY - playerY

    angle = Math.atan2(minusY, minusX) * 180 / Math.PI

    mainPlayer.style.transform = `rotate(${angle}deg)`
})

//!ates
main.addEventListener("click", () => {

    shootSound.currentTime = 0
    shootSound.play()

    let bullet = document.createElement("div")
    bullet.classList.add("bullet")

    main.append(bullet)

    let bulletX = playerX
    let bulletY = playerY

    let speed = 20

    bullet.style.left = playerX + "px"
    bullet.style.top = playerY + "px"

    let bulletAngle = angle
    
    let shot = setInterval(() => {

        bulletX += Math.cos(bulletAngle * Math.PI / 180) * speed
        bulletY += Math.sin(bulletAngle * Math.PI / 180) * speed

        bullet.style.left = bulletX + "px"
        bullet.style.top = bulletY + "px"

        bullet.style.transform = `rotate(${bulletAngle}deg)`

        if(bulletY<=0 || bulletY>=380 || bulletX>=1500){
            bullet.remove()
            clearInterval(shot)
        }

        //!gulle zombiye deyir
        let zombies = document.querySelectorAll(".zombie")
        zombies.forEach(zombie=>{
            let zombieX = Number(zombie.dataset.x)
            let zombieY = Number(zombie.dataset.y)
            if(bulletX>=zombieX && bulletX<=zombieX+70&&
                bulletY>=zombieY && bulletY<=zombieY+120&&
                zombie.dataset.dead == "false"){
                    bullet.remove()
                    clearInterval(shot)

                    let zombieHealth = Number(zombie.dataset.health)
                    zombieHealth--
                    let health = zombie.querySelector(".health")
                    health.style.width = 25*zombieHealth+"%"
                    zombie.dataset.health = zombieHealth
                    if(zombieHealth<=0){
                        zombie.dataset.dead = "true"

                        //!oldukden sonra can barini silir
                        zombie.querySelector(".zombieHealthBar").remove()

                        //! zombinin olum animasiyalari
                        zombie.classList.remove("zombie1","zombie2")
                        zombie.classList.add("zombieDead-1")
                        setTimeout(()=>{
                            zombie.classList.remove("zombieDead-1")
                            zombie.classList.add("zombieDead-2")
                        },100)
                        setTimeout(()=>{
                            zombie.classList.remove("zombieDead-2")
                            zombie.classList.add("zombieDead-3")
                        },500)
                        setTimeout(()=>{
                            zombie.classList.remove("zombieDead-3")
                            zombie.classList.add("zombieDead-4")
                        },800)
                        setTimeout(()=>{
                            zombie.classList.remove("zombieDead-4")
                            zombie.classList.add("zombieDead-5")
                        },1000)
                        setTimeout(()=>{
                            zombie.remove()
                        },2000)
                    }
                }
        })
    }, 10)
})

//!random zombie yaratmaq
function createZombie(){
    let zombie = document.createElement("div")
    let zombieHealthBar = document.createElement("div")
    let health = document.createElement("div")

    zombie.classList.add("zombie1")
    zombie.classList.add("zombie")

    zombieHealthBar.classList.add("zombieHealthBar")

    health.classList.add("health")
    
    main.append(zombie)
    zombie.append(zombieHealthBar)
    zombieHealthBar.append(health)
    
    let zombieX = 1400
    let zombieY = Math.floor((Math.random()*80)+180)

    zombie.dataset.x = zombieX
    zombie.dataset.y = zombieY

    //! zombinin cani
    zombie.dataset.health = 4
    zombie.dataset.dead = "false"

    zombie.style.left = zombieX + "px"
    zombie.style.top = zombieY + "px"

    //!zombinin hereketi
    let zombieMove = setInterval(()=>{

        if(zombie.dataset.dead == "true"){
            clearInterval(zombieMove)
            return
        }

        zombieX --

        zombie.dataset.x = zombieX

        zombie.style.left = zombieX + "px"

        //! bura catanda zombi silinir
        if(zombieX<=300){
            zombie.remove()
            clearInterval(zombieMove)
            clearInterval(zombieWalk)
        }
    },30)

    //! zombinin yerime animasiyasi
    let zombieWalk = setInterval(()=>{

        if(zombie.dataset.dead == "true"){
            clearInterval(zombieWalk)
            return
        }

        zombie.classList.toggle("zombie2")
        zombie.classList.toggle("zombie1")
    },700)
}

//! zombiler nece saniyeden bir yaransin
setInterval(()=>{
    createZombie()
},5000)
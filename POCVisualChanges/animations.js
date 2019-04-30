const dim = $(".dimension-row h3")[0]
const am = $("#antimatter")[0]


let dimViewPort = dim.getBoundingClientRect()
let amViewPort  = am.getBoundingClientRect()

window.onresize = () => {
    dimViewPort = dim.getBoundingClientRect()
    amViewPort  = am.getBoundingClientRect()
}


class Particle {
    constructor(x, y, dx, dy) {
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
        this.t = 0
        this.v = Math.random() + 0.5
        this.x1 = (this.x + this.dx)/2 + (this.dy - this.y) * 0.3 * normalDistribution(0, 1)
        this.y1 = (this.y + this.dy)/2 - (this.dx - this.x) * 0.3 * normalDistribution(0, 1)
        this.x2 = this.x1
        this.y2 = this.y1
        this.el = $("<div class='particle'></div>")

        $("body").append(this.el)
    }


    get location() {

        let x = (1-this.t) * ((1-this.t) * ((1-this.t) * this.x+this.t * this.x1)+this.t * ((1-this.t) * this.x1+this.t * this.x2))+this.t * ((1-this.t) * ((1-this.t) * this.x1+this.t * this.x2)+this.t * ((1-this.t) * this.x2+this.t * this.dx))
        let y = (1-this.t) * ((1-this.t) * ((1-this.t) * this.y+this.t * this.y1)+this.t * ((1-this.t) * this.y1+this.t * this.y2))+this.t * ((1-this.t) * ((1-this.t) * this.y1+this.t * this.y2)+this.t * ((1-this.t) * this.y2+this.t * this.dy))

        return { x, y }
    }

    tick() {
        this.t += 0.03
        this.el.css({"top": this.location.y + "px", "left": this.location.x + "px"})
        if (this.t >= 1) this.el.remove()
    }

}



var particles  = []



setInterval(() => {

    particles.push(
        new Particle(
            dimViewPort.x + 60, 
            dimViewPort.y - 95, 
            amViewPort.x  + 30 + Math.random() * 60, 
            amViewPort.y - 95
        )
    )

    for (let i = 0; i < particles.length; i++) {
        let p = particles[i]

        p.tick()


        if (p.t >= 1) {
            particles.splice(i--, 1)
        }
    }
    
}, 1000 / 30)
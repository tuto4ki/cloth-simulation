import { SIZE_CLOTH } from './constants.js';

export default function animationFrame(vertices, verticesPrev, links) {
  const index = Math.floor(SIZE_CLOTH * 4 + SIZE_CLOTH / 2) * 3 + 1;
  let direction = 1;
  return (fTimeStep) => {
    console.log(vertices[index]);
    if (vertices[index] >= .15 || vertices[index] <= -.15) {
      direction *= -1;
    }
    //console.log(vertices[index]);
    vertices[index] += Math.sin(.0016) * direction;

    //ParticleSystemVerlet(vertices, verticesPrev, fTimeStep / 10000);
    //SatisfyConstraints(vertices, links);

    return { vertices, verticesPrev};
  };
}

function ParticleSystemVerlet(vertices, verticesPrev, fTimeStep) {
  if (!fTimeStep) {
    return;
  }
  const numVertices = vertices.length;
  for (let i = 0; i < numVertices; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const z = vertices[i + 2];
    const tempX = x;
    const tempY = y;
    const tempZ = z;
    const oldX = verticesPrev[i];
    const oldY = verticesPrev[i + 1];
    const oldZ = verticesPrev[i + 2];
    const a = .0;
    //vertices[i] += x - oldX + a * fTimeStep * fTimeStep;
    vertices[i + 1] += y - oldY + a * fTimeStep * fTimeStep;
    //vertices[i + 2] += z - oldZ + a * fTimeStep * fTimeStep;
    //verticesPrev[i] = tempX;
    verticesPrev[i + 1] = tempY;
    //verticesPrev[i + 2] = tempZ;
  }
}

function SatisfyConstraints(vertices, links) {
  for(let i = 0; i < 3; i++) {
    /*for (let j = 0; j < vertices.length; j += 3) {
      const x = vertices[j];
      const y = vertices[j + 1];
      const z = vertices[j + 2];
      vertices[j] = Math.min(Math.max(x, -.15), .15);
      vertices[j + 1] = Math.min(Math.max(y, -.15), .15);
      vertices[j + 2] = Math.min(Math.max(z, -.15), .15);
    }*/
    const pointX1 = vertices[0];
    const pointY1 = vertices[1];
    const pointZ1 = vertices[2];
    const pointX2 = vertices[10];
    const pointY2 = vertices[1];
    const pointZ2 = vertices[2];
    for(let j = 3; j < links.length; j++) {
      const indexPoint1 = links.p1 * 3;
      const indexPoint2 = links.p2 * 3;

      const dx = vertices[indexPoint1] - vertices[indexPoint2];
      const dy = vertices[indexPoint1 + 1] - vertices[indexPoint2 + 1];
      const dz = vertices[indexPoint1 + 2] - vertices[indexPoint2 + 2];
      const deltaLength = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const diff = (deltaLength - .1) / deltaLength;
      vertices[indexPoint1] -= dx * 0.5 * diff;
      vertices[indexPoint1 + 1] -= dy * 0.5 * diff;
      vertices[indexPoint1 + 2] -= dz * 0.5 * diff;
      vertices[indexPoint2] += dx * 0.5 * diff;
      vertices[indexPoint2 + 1] += dy * 0.5 * diff;
      vertices[indexPoint2 + 2] += dz * 0.5 * diff;
    }
    
  }
}


/*document.getElementById('close').onmousedown = function(e) {
  e.preventDefault();
  document.getElementById('info').style.display = 'none';
  return false;
};

// settings

var physics_accuracy  = 3,
    mouse_influence   = 20,
    mouse_cut         = 5,
    gravity           = 1200,
    cloth_height      = 30,
    cloth_width       = 50,
    start_y           = 20,
    spacing           = 7,
    tear_distance     = 60;


window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
};

var canvas,
    ctx,
    cloth,
    boundsx,
    boundsy,
    mouse = {
        down: false,
        button: 1,
        x: 0,
        y: 0,
        px: 0,
        py: 0
    };

var Point = function (x, y) {
    this.x      = x;
    this.y      = y;
    this.px     = x;
    this.py     = y;
    this.vx     = 0;
    this.vy     = 0;
    this.pin_x  = null;
    this.pin_y  = null;
    
    this.constraints = [];
};

Point.prototype.update = function (delta) {
    if (mouse.down) {
        var diff_x = this.x - mouse.x,
            diff_y = this.y - mouse.y,
            dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);

        if (mouse.button == 1) {
            if (dist < mouse_influence) {
                this.px = this.x - (mouse.x - mouse.px) * 1.8;
                this.py = this.y - (mouse.y - mouse.py) * 1.8;
            }
          
        } else if (dist < mouse_cut) this.constraints = [];
    }

    this.add_force(0, gravity);

    delta *= delta;
    nx = this.x + ((this.x - this.px) * .99) + ((this.vx / 2) * delta);
    ny = this.y + ((this.y - this.py) * .99) + ((this.vy / 2) * delta);

    this.px = this.x;
    this.py = this.y;

    this.x = nx;
    this.y = ny;

    this.vy = this.vx = 0
};

Point.prototype.draw = function () {
    if (!this.constraints.length) return;

    var i = this.constraints.length;
    while (i--) this.constraints[i].draw();
};

Point.prototype.resolve_constraints = function () {
    if (this.pin_x != null && this.pin_y != null) {
        this.x = this.pin_x;
        this.y = this.pin_y;
        return;
    }

    var i = this.constraints.length;
    while (i--) this.constraints[i].resolve();

    this.x > boundsx ? this.x = 2 * boundsx - this.x : 1 > this.x && (this.x = 2 - this.x);
    this.y < 1 ? this.y = 2 - this.y : this.y > boundsy && (this.y = 2 * boundsy - this.y);
};

Point.prototype.attach = function (point) {
    this.constraints.push(
        new Constraint(this, point)
    );
};

Point.prototype.remove_constraint = function (constraint) {
    this.constraints.splice(this.constraints.indexOf(constraint), 1);
};

Point.prototype.add_force = function (x, y) {
    this.vx += x;
    this.vy += y;
  
    var round = 400;
    this.vx = ~~(this.vx * round) / round;
    this.vy = ~~(this.vy * round) / round;
};

Point.prototype.pin = function (pinx, piny) {
    this.pin_x = pinx;
    this.pin_y = piny;
};

var Constraint = function (p1, p2) {
    this.p1     = p1;
    this.p2     = p2;
    this.length = spacing;
};

Constraint.prototype.resolve = function () {
    var diff_x  = this.p1.x - this.p2.x,
        diff_y  = this.p1.y - this.p2.y,
        dist    = Math.sqrt(diff_x * diff_x + diff_y * diff_y),
        diff    = (this.length - dist) / dist;

    if (dist > tear_distance) this.p1.remove_constraint(this);

    var px = diff_x * diff * 0.5;
    var py = diff_y * diff * 0.5;

    this.p1.x += px;
    this.p1.y += py;
    this.p2.x -= px;
    this.p2.y -= py;
};

Constraint.prototype.draw = function () {
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
};

var Cloth = function () {
    this.points = [];

    var start_x = canvas.width / 2 - cloth_width * spacing / 2;

    for (var y = 0; y <= cloth_height; y++) {
        for (var x = 0; x <= cloth_width; x++) {
            var p = new Point(start_x + x * spacing, start_y + y * spacing);

            x != 0 && p.attach(this.points[this.points.length - 1]);
            y == 0 && p.pin(p.x, p.y);
            y != 0 && p.attach(this.points[x + (y - 1) * (cloth_width + 1)])

            this.points.push(p);
        }
    }
};

Cloth.prototype.update = function () {
    var i = physics_accuracy;

    while (i--) {
        var p = this.points.length;
        while (p--) this.points[p].resolve_constraints();
    }

    i = this.points.length;
    while (i--) this.points[i].update(.016);
};

Cloth.prototype.draw = function () {
    ctx.beginPath();

    var i = cloth.points.length;
    while (i--) cloth.points[i].draw();

    ctx.stroke();
};

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cloth.update();
    cloth.draw();

    requestAnimFrame(update);
}

function start() {
    canvas.onmousedown = function (e) {
        mouse.button  = e.which;
        mouse.px      = mouse.x;
        mouse.py      = mouse.y;
        var rect      = canvas.getBoundingClientRect();
        mouse.x       = e.clientX - rect.left,
        mouse.y       = e.clientY - rect.top,
        mouse.down    = true;
        e.preventDefault();
    };

    canvas.onmouseup = function (e) {
        mouse.down = false;
        e.preventDefault();
    };

    canvas.onmousemove = function (e) {
        mouse.px  = mouse.x;
        mouse.py  = mouse.y;
        var rect  = canvas.getBoundingClientRect();
        mouse.x   = e.clientX - rect.left,
        mouse.y   = e.clientY - rect.top,
        e.preventDefault();
    };

    canvas.oncontextmenu = function (e) {
        e.preventDefault();
    };

    boundsx = canvas.width - 1;
    boundsy = canvas.height - 1;

    ctx.strokeStyle = '#888';
  
    cloth = new Cloth();
  
    update();
}

window.onload = function () {
    canvas  = document.getElementById('c');
    ctx     = canvas.getContext('2d');

    canvas.width  = 560;
    canvas.height = 350;

    start();
};*/
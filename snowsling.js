"use strict";

let snowsling = {};
{
    snowsling.linearize = function(f) {
        if(f < 0.04045) return f * (1/12.92);
        else return Math.pow((f+0.055) * (1/1.055), 2.4);
    };
    snowsling.delinearize = function(f) {
        if(f <= 0.0031308) return f * 12.92;
        else return 1.055 * Math.pow(f, 1/2.4) - 0.055;
    };
    snowsling.ColorRGB = function(r,g,b) {
        this.r = r;
        this.g = g;
        this.b = b;
    };
    snowsling.ColorLinearRGB = function(r$,g$,b$) {
        this.r$ = r$;
        this.g$ = g$;
        this.b$ = b$;
    };
    snowsling.ColorXYZ = function(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    };
    snowsling.ColorLab = function(l,a,b) {
        this.l = l;
        this.a = a;
        this.b = b;
    };
    snowsling.ColorRGB.prototype.toLinearRGB = function() {
        return new snowsling.ColorLinearRGB(snowsling.linearize(this.r),
                                            snowsling.linearize(this.g),
                                            snowsling.linearize(this.b));
    };
    snowsling.ColorLinearRGB.prototype.toRGB = function() {
        return new snowsling.ColorRGB(snowsling.delinearize(this.r$),
                                      snowsling.delinearize(this.g$),
                                      snowsling.delinearize(this.b$));
    };
    snowsling.ColorLinearRGB.prototype.toXYZ = function() {
        return new snowsling.ColorXYZ(
            this.r$ * 0.4124 + this.g$ * 0.3576 + this.b$ * 0.1805,
            this.r$ * 0.2126 + this.g$ * 0.7152 + this.b$ * 0.0722,
            this.r$ * 0.0193 + this.g$ * 0.1192 + this.b$ * 0.9505
        );
    };
    snowsling.ColorXYZ.prototype.toLinearRGB = function() {
        return new snowsling.ColorLinearRGB(
            this.x * 3.2406 + this.y * -1.5372 + this.z * -0.4986,
            this.x * -0.9689 + this.y * 1.8758 + this.z * 0.0415,
            this.x * 0.0557 + this.y * -0.2040 + this.z * 1.0570
        );
    };
    const X_ILLUMINANT = 0.95047;
    const Y_ILLUMINANT = 1.00000;
    const Z_ILLUMINANT = 1.08883;
    const X_ILLUMINANT_INVERSE = 1 / X_ILLUMINANT;
    const Y_ILLUMINANT_INVERSE = 1 / Y_ILLUMINANT;
    const Z_ILLUMINANT_INVERSE = 1 / Z_ILLUMINANT;
    const LAB_DELTA = 6/29;
    const LAB_DELTA_CUBED = (6*6*6)/(29*29*29);
    const TRIPLE_LAB_DELTA_SQUARED = (6*6*3)/(29*29);
    const INVERSE_TRIPLE_LAB_DELTA_SQUARED = (29*29)/(6*6*3);
    let Labf = function(t) {
        if(t > LAB_DELTA_CUBED) return Math.cbrt(t);
        else return t * INVERSE_TRIPLE_LAB_DELTA_SQUARED + 4/29;
    };
    let inverse_Labf = function(t) {
        if(t > LAB_DELTA) return t*t*t;
        else return TRIPLE_LAB_DELTA_SQUARED * (t - 4/29);
    };
    snowsling.ColorXYZ.prototype.toLab = function() {
        let fxn = Labf(this.x * X_ILLUMINANT_INVERSE);
        let fyn = Labf(this.y * Y_ILLUMINANT_INVERSE);
        let fzn = Labf(this.z * Z_ILLUMINANT_INVERSE);
        return new snowsling.ColorLab(
            1.16 * fyn - 0.16,
            5 * (fxn - fyn),
            2 * (fyn - fzn)
        );
    };
    snowsling.ColorLab.prototype.toXYZ = function() {
        let l$ = (this.l + 0.16) * (1/1.16);
        let a$ = (this.a * (1/5));
        let b$ = (this.b * (1/2));
        return new snowsling.ColorXYZ(
            X_ILLUMINANT * inverse_Labf(l$ + a$),
            Y_ILLUMINANT * inverse_Labf(l$),
            Z_ILLUMINANT * inverse_Labf(l$ - b$)
        );
    };
    // now fill in the gaps!
    snowsling.ColorRGB.prototype.toXYZ = function() {
        return this.toLinearRGB().toXYZ();
    };
    snowsling.ColorRGB.prototype.toLab = function() {
        return this.toLinearRGB().toXYZ().toLab();
    };
    snowsling.ColorXYZ.prototype.toRGB = function() {
        return this.toLinearRGB().toRGB();
    };
    snowsling.ColorLab.prototype.toLinearRGB = function() {
        return this.toXYZ().toLinearRGB();
    };
    snowsling.ColorLab.prototype.toRGB = function() {
        return this.toXYZ().toLinearRGB().toRGB();
    };
}

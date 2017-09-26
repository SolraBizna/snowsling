This is a quick and dirty JavaScript library that does some colorspace conversions. The entire library is contained in the `snowsling` object.

The library provides four Color classes. An instance of a color class contains named keys for its three color components, and provides methods for converting to the other supported color spaces.

`new snowsling.ColorRGB(r,g,b)`: An sRGB color, where 0 is black and 1 is maximum intensity. Provides `toLinearRGB()`, `toXYZ()`, and `toLab()`.  
`new snowsling.ColorLinearRGB(r$,g$,b$)`: A linear RGB color (with sRGB primaries). Provides `toRGB()`, `toXYZ()`, and `toLab()`.  
`new snowsling.ColorXYZ(x,y,z)`: A CIE 1931 XYZ color. Provides `toRGB()`, `toLinearRGB()`, and `toLab()`.  
`new snowsling.ColorLab(l,a,b)`: A L\*a\*b\* color with the D65 illuminant. Provides `toRGB()`, `toLinearRGB()`, and `toXYZ()`.

In case they're needed, the following two methods are also provided:

`snowsling.linearize(t)`: Turn an sRGB gamma corrected value into a linear one.  
`snowsling.delinearize(t)`: Convert a linear value into an sRGB gamma corrected one.



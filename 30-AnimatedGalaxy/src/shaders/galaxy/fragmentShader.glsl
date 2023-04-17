varying vec3 vColor;

void main() {

    // disc pattern
    // vec2 center = vec2(0.5);
    // float strength = distance(gl_PointCoord, center);
    // strength = step(0.5, strength);
    // strength = 1.0 - strength;

    // Diffuse point pattern
    // vec2 center = vec2(0.5);
    // float strength = distance(gl_PointCoord, center);
    // strength *= 2.0;
    // strength = 1.0 - strength;

    // Light point pattern
    vec2 center = vec2(0.5);
    float strength = distance(gl_PointCoord, center);
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);

    // Final color
    vec3 black = vec3(0.0);
    vec3 color = mix(black, vColor, strength);

    gl_FragColor = vec4(color, 1.0);

}
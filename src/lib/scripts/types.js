/**
 * @typedef Coords Cartesian co-ordinates of a point
 * @prop { number } x The x position of a point
 * @prop { number } y The y position of a point
 */

/**
 * @typedef GraphCoords The positions of the two cubic bezier control points
 * @prop { Coords } p1 The coordinate positions of the first point
 * @prop { Coords } p2 The coordinate position of the second point
 */

/**
 * @typedef Control A control point and it's associated data
 * @prop { Coords } position The offset position of the button on the graph
 * @prop { boolean } isReadyToDrag Indicates whether the button is ready to drag on the graph
 */

/** @typedef { 'position' | 'rotation' | 'size' | 'opacity' } PreviewMode The mode of the bezier animation preview */

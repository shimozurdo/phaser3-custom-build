require("polyfills");

var CONST = require("const");
var Extend = require("utils/object/Extend");

var Phaser = {

    Actions: require("actions"),
    Animations: require("animations"),
    Cameras: {
        Scene2D: require("cameras/2d")
    },
    Core: require("core"),
    Class: require("utils/Class"),
    Create: require("create"),
    Data: require("data"),
    Display: require("display"),
    Events: require("events/EventEmitter"),
    Game: require("core/Game"),
    GameObjects: {
        DisplayList: require("gameobjects/DisplayList"),
        UpdateList: require("gameobjects/UpdateList"),
        BitmapText: require("gameobjects/bitmaptext/static/BitmapText"),
        Graphics: require("gameobjects/graphics/Graphics.js"),
        Group: require("gameobjects/group/Group"),
        Image: require("gameobjects/image/Image"),
        Rectangle: require("gameobjects/shape/rectangle/Rectangle"),
        Sprite: require("gameobjects/sprite/Sprite"),
        Text: require("gameobjects/text/static/Text"),
        TileSprite: require("gameobjects/tilesprite/TileSprite"),
        Factories: {
            BitmapText: require("gameobjects/bitmaptext/static/BitmapTextFactory"),
            Graphics: require("gameobjects/graphics/GraphicsFactory"),
            Group: require("gameobjects/group/GroupFactory"),
            Image: require("gameobjects/image/ImageFactory"),
            Rectangle: require("gameobjects/shape/rectangle/RectangleFactory"),
            Sprite: require("gameobjects/sprite/SpriteFactory"),
            Text: require("gameobjects/text/static/TextFactory"),
            TileSprite: require("gameobjects/tilesprite/TileSpriteFactory")
        },
        Creators: {
            BitmapText: require("gameobjects/bitmaptext/static/BitmapTextCreator"),
            Graphics: require("gameobjects/graphics/GraphicsCreator"),
            Group: require("gameobjects/group/GroupCreator"),
            Image: require("gameobjects/image/ImageCreator"),
            Sprite: require("gameobjects/sprite/SpriteCreator"),
            Text: require("gameobjects/text/static/TextCreator"),
            TileSprite: require("gameobjects/tilesprite/TileSpriteCreator")
        }
    },
    Input: require("input"),
    Loader: {
        FileTypes: {
            AudioFile: require("loader/filetypes/AudioFile"),
            BitmapFontFile: require("loader/filetypes/BitmapFontFile"),
            ImageFile: require("loader/filetypes/ImageFile"),
            TilemapJSONFile: require("loader/filetypes/TilemapJSONFile"),
            SpriteSheetFile: require("loader/filetypes/SpriteSheetFile"),
            ScriptFile: require("loader/filetypes/ScriptFile"),
        },
        LoaderPlugin: require("loader/LoaderPlugin")
    },
    Math: {
        Between: require("math/Between")
    },
    Physics: {
        Arcade: require("physics/arcade")
    },
    Plugins: require("plugins"),
    Renderer: require("renderer"),
    Scale: require("scale"),
    Scene: require("scene/Scene"),
    Scenes: require("scene"),
    Sound: require("sound"),
    TileMaps: require("tilemaps"),
    Time: require("time"),
    Tweens: require("tweens")

};

//  Merge in the consts

Phaser = Extend(false, Phaser, CONST);

//  Export it

module.exports = Phaser;

global.Phaser = Phaser;

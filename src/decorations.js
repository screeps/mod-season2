module.exports = function(config) {
  if(config.backend) {
    function getDecorations(location) {
      const wall = {
        "active": {
          "foregroundColor": "#FFFF",
          "foregroundBrightness": 1,
          "foregroundAlpha": 1,
          "backgroundColor": "#011417",
          "backgroundBrightness": 1,
          "strokeColor": "#10191B",
          "strokeBrightness": 1,
          "strokeLighting": 1,
          "strokeWidth": 34,
          "world": true,
          "room": location.room
        },
        "decoration": {
          "graphics": [],
          "type": "wallLandscape",
          "name": "Seasonal wall",
          "foregroundUrl": `${config.assetsUrl}walls.png`
        }
      };
      const floor = {
        "active": {
          "floorBackgroundColor": "#51787A",
          "floorBackgroundBrightness": 1,
          "floorForegroundColor": "#446D70",
          "floorForegroundBrightness": 1,
          "floorForegroundAlpha": 1,
          "swampColor": "#FF1F1F",
          "swampStrokeColor": "#C70F0F",
          "swampStrokeWidth": 40,
          "roadsColor": "#77B2A4",
          "roadsBrightness": 1,
          "world": true,
          "room": location.room
        },
        "decoration": {
          "graphics": [],
          "type": "floorLandscape",
          "name": "Seasonal floor",
          "floorForegroundUrl": `${config.assetsUrl}floor.png`,
          "tileScale": 1.5
        }
      };
      if(location.shard) {
        wall.active.shard = location.shard;
        floor.active.shard = location.shard;
      }

      return [floor, wall];
    };

    config.backend.on('expressPostConfig', function(app) {
      config.backend.router.get('/game/room-decorations', (request, response) => {
        const decorations = getDecorations(request.query);
        response.json({ ok: 1, decorations });
      });
    });
  }
}

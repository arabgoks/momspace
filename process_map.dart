import 'dart:convert';
import 'dart:io';

void main() async {
  final file = File('liberty.json');
  final jsonString = await file.readAsString();
  final data = json.decode(jsonString);

  final layers = List<Map<String, dynamic>>.from(data['layers']);
  final newLayers = <Map<String, dynamic>>[];

  for (var layer in layers) {
    final id = layer['id'] as String;
    final type = layer['type'] as String;
    final sourceLayer = layer['source-layer'] as String?;
    
    // Hide all POIs and icons
    if (type == 'symbol') {
      if (id.contains('poi') || id.contains('icon') || id.contains('place') || sourceLayer == 'poi') {
        continue;
      }
    }

    final paint = layer['paint'] as Map<String, dynamic>? ?? {};

    // Background / Land
    if (id == 'background') {
      paint['background-color'] = '#F4E8DA';
    }
    if (sourceLayer == 'landcover' || sourceLayer == 'landuse') {
      if (id.contains('park') || id.contains('grass') || id.contains('wood') || id.contains('forest') || id.contains('pitch')) {
        paint['fill-color'] = '#C6D8C2';
      } else {
        paint['fill-color'] = '#F4E8DA'; // other landuse
      }
    }

    // Water
    if (sourceLayer == 'water' || sourceLayer == 'waterway') {
      if (type == 'fill') paint['fill-color'] = '#DCE7EB';
      if (type == 'line') paint['line-color'] = '#DCE7EB';
    }

    // Roads
    if (sourceLayer == 'transportation') {
      if (type == 'line') {
        paint['line-color'] = '#FFFFFF';
        // Make lines a bit thicker if possible, we keep existing logic mostly but just white
      }
    }
    
    // Road labels
    if (type == 'symbol' && sourceLayer == 'transportation_name') {
      if (paint.containsKey('text-color')) {
        paint['text-color'] = '#B9A38F';
      }
      if (paint.containsKey('text-halo-color')) {
        paint['text-halo-color'] = '#F4E8DA';
        paint['text-halo-width'] = 2;
      }
      final layout = layer['layout'] as Map<String, dynamic>? ?? {};
      layout['text-font'] = ['Nunito Bold', 'Open Sans Regular']; // Fallback
      layout['text-size'] = 10;
      layer['layout'] = layout;
    }

    // Buildings 2D
    if (sourceLayer == 'building' && type == 'fill') {
      paint['fill-color'] = '#F0E0CC';
    }

    layer['paint'] = paint;
    newLayers.add(layer);
  }

  // Add 3D building layer
  newLayers.add({
    "id": "3d-buildings",
    "source": "openfreemap",
    "source-layer": "building",
    "type": "fill-extrusion",
    "minzoom": 15,
    "paint": {
      "fill-extrusion-color": "#EFDBC4",
      "fill-extrusion-height": ["get", "render_height"],
      "fill-extrusion-base": ["get", "render_min_height"],
      "fill-extrusion-opacity": 0.85
    }
  });

  data['layers'] = newLayers;

  final outFile = File('assets/map_style_momspace.json');
  await outFile.writeAsString(json.encode(data));
  print('Saved map_style_momspace.json');
}

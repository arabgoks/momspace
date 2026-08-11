import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

/// Renders a Flutter widget to a PNG byte array.
/// Useful for passing custom UI widgets as map markers to MapLibre.
Future<Uint8List> rasterizeWidget(
  Widget widget, {
  required BuildContext context,
  Size logicalSize = const Size(50, 50),
}) async {
  final repaintBoundary = RenderRepaintBoundary();
  
  final renderView = RenderView(
    view: View.of(context),
    child: RenderPositionedBox(alignment: Alignment.center, child: repaintBoundary),
    configuration: ViewConfiguration(
      logicalConstraints: BoxConstraints.tight(logicalSize),
      devicePixelRatio: MediaQuery.devicePixelRatioOf(context),
    ),
  );

  final pipelineOwner = PipelineOwner();
  final buildOwner = BuildOwner(focusManager: FocusManager());

  pipelineOwner.rootNode = renderView;
  renderView.prepareInitialFrame();

  final rootElement = RenderObjectToWidgetAdapter<RenderBox>(
    container: repaintBoundary,
    child: Directionality(
      textDirection: TextDirection.ltr,
      child: widget,
    ),
  ).attachToRenderTree(buildOwner);

  buildOwner.buildScope(rootElement);
  buildOwner.finalizeTree();

  pipelineOwner.flushLayout();
  pipelineOwner.flushCompositingBits();
  pipelineOwner.flushPaint();

  final image = await repaintBoundary.toImage(
    pixelRatio: MediaQuery.devicePixelRatioOf(context),
  );
  final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
  
  return byteData!.buffer.asUint8List();
}

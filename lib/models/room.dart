import 'package:maplibre_gl/maplibre_gl.dart';

/// A lactation room listing, as surfaced in the Home/Map bottom sheet.
/// Source: README.md § State Management › Home Map / Detail.
class Room {
  const Room({
    required this.id,
    required this.name,
    required this.avatarInitial,
    required this.floorLabel,
    required this.distanceMeters,
    required this.isOpen,
    required this.rating,
    required this.reviewCount,
    required this.position,
    this.facilities = const [],
  });

  final String id;
  final String name;
  final String avatarInitial;
  final String floorLabel;
  final int distanceMeters;
  final bool isOpen;
  final double rating;
  final int reviewCount;
  final List<String> facilities;
  final LatLng position;

  String get distanceLabel {
    if (distanceMeters < 1000) return '$distanceMeters m';
    final km = distanceMeters / 1000;
    return '${km.toStringAsFixed(1)} km';
  }
}

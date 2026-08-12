import 'package:flutter/material.dart';
import 'package:maplibre_gl/maplibre_gl.dart';

import '../theme/app_colors.dart';
import '../theme/app_typography.dart';
import '../utils/map_marker_utils.dart';
import '../widgets/home_map/map_pin.dart';

/// Full-screen map picker for "Titik di peta". Tap anywhere on the map to
/// drop a pin; "Gunakan lokasi ini" confirms and pops the picked [LatLng].
/// Source: design_handoff_momspace/README.md § 5 Tambah Lokasi Baru ›
/// Titik di peta (implemented as tap-to-place rather than a draggable
/// center-pin — see plan note).
class LocationPickerScreen extends StatefulWidget {
  const LocationPickerScreen({super.key, this.initialPosition});

  final LatLng? initialPosition;

  @override
  State<LocationPickerScreen> createState() => _LocationPickerScreenState();
}

class _LocationPickerScreenState extends State<LocationPickerScreen> {
  static const _defaultCenter = LatLng(-6.1935, 106.8230);

  MapLibreMapController? _mapController;
  LatLng? _picked;
  bool _pinImageLoaded = false;

  @override
  void initState() {
    super.initState();
    _picked = widget.initialPosition;
  }

  Future<void> _loadPinImage() async {
    if (_mapController == null) return;
    final png = await rasterizeWidget(
      const MapPin(state: PinState.selected),
      context: context,
      logicalSize: const Size(38, 48),
    );
    await _mapController!.addImage('picker-pin', png);
    setState(() => _pinImageLoaded = true);
    if (_picked != null) {
      await _mapController!.addSymbol(
        SymbolOptions(geometry: _picked, iconImage: 'picker-pin', iconAnchor: 'bottom'),
      );
    }
  }

  Future<void> _onMapClick(point, coordinates) async {
    setState(() => _picked = coordinates as LatLng);
    if (_mapController == null || !_pinImageLoaded) return;
    await _mapController!.clearSymbols();
    await _mapController!.addSymbol(
      SymbolOptions(geometry: _picked, iconImage: 'picker-pin', iconAnchor: 'bottom'),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          MapLibreMap(
            initialCameraPosition: CameraPosition(target: widget.initialPosition ?? _defaultCenter, zoom: 16),
            styleString: 'assets/map_style_momspace.json',
            onMapCreated: (controller) => _mapController = controller,
            onStyleLoadedCallback: _loadPinImage,
            onMapClick: _onMapClick,
          ),
          Positioned(
            top: MediaQuery.paddingOf(context).top + 12,
            left: 14,
            child: _BackCircle(onTap: () => Navigator.pop(context)),
          ),
          Positioned(
            top: MediaQuery.paddingOf(context).top + 12,
            left: 66,
            right: 14,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
              child: Text(
                'Ketuk peta untuk menandai lokasi',
                style: AppTypography.quicksand(fontSize: 12.5, fontWeight: FontWeight.w700, color: AppColors.body),
              ),
            ),
          ),
          Positioned(
            left: 14,
            right: 14,
            bottom: MediaQuery.paddingOf(context).bottom + 16,
            child: Column(
              children: [
                if (_picked != null)
                  Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
                    child: Text(
                      '${_picked!.latitude.toStringAsFixed(4)}° LS, ${_picked!.longitude.toStringAsFixed(4)}° BT',
                      style: AppTypography.mono(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.body),
                    ),
                  ),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _picked == null ? null : () => Navigator.pop(context, _picked),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _picked == null ? AppColors.disabledFill : AppColors.primary,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                      elevation: 0,
                    ),
                    child: Text(
                      'Gunakan lokasi ini',
                      style: AppTypography.nunito(fontSize: 14, fontWeight: FontWeight.w800, color: _picked == null ? AppColors.textFaint : Colors.white),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _BackCircle extends StatelessWidget {
  const _BackCircle({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      shape: const CircleBorder(),
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: onTap,
        child: const SizedBox(width: 38, height: 38, child: Icon(Icons.arrow_back_rounded, size: 20, color: AppColors.ink)),
      ),
    );
  }
}

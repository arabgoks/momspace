import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:maplibre_gl/maplibre_gl.dart';
import 'package:geolocator/geolocator.dart';

import '../data/demo_rooms.dart';
import '../data/repository.dart';
import '../models/room.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';
import '../utils/map_marker_utils.dart';
import '../widgets/home_map/floating_map_actions.dart';
import '../widgets/home_map/map_pin.dart';
import '../widgets/home_map/room_bottom_sheet.dart';
import '../widgets/home_map/search_pill.dart';
import '../widgets/home_map/user_location_dot.dart';
import '../widgets/home_map/warm_map_background.dart';
import '../widgets/nav/classic_pill_navbar.dart';

class HomeMapScreen extends StatefulWidget {
  const HomeMapScreen({super.key, this.onRoomSelected, this.onSearchTap});

  final ValueChanged<Room?>? onRoomSelected;
  final VoidCallback? onSearchTap;

  @override
  State<HomeMapScreen> createState() => _HomeMapScreenState();
}

class _HomeMapScreenState extends State<HomeMapScreen> {
  String? _selectedRoomId;
  bool _loadingSelection = false;

  MapLibreMapController? _mapController;
  bool _mapStyleLoaded = false;
  bool _mapError = false;
  LatLng? _userLocation;

  SheetVariant get _sheetVariant {
    if (_loadingSelection) return SheetVariant.loading;
    return _selectedRoomId == null ? SheetVariant.empty : SheetVariant.defaultRoom;
  }

  Room? get _selectedRoom {
    if (_selectedRoomId == null) return null;
    if (demoSelectedRoom.id == _selectedRoomId) return demoSelectedRoom;
    return demoNearbyRooms.firstWhere((r) => r.id == _selectedRoomId, orElse: () => demoSelectedRoom);
  }

  Future<void> _selectRoom(String id) async {
    setState(() => _loadingSelection = true);
    await Future<void>.delayed(const Duration(milliseconds: 450));
    if (!mounted) return;
    setState(() {
      _selectedRoomId = id;
      _loadingSelection = false;
    });
    _updateSymbols();
    widget.onRoomSelected?.call(_selectedRoom);
  }

  Future<void> _loadMarkerImages() async {
    if (_mapController == null) return;
    try {
      final availablePng = await rasterizeWidget(const MapPin(state: PinState.available), context: context, logicalSize: const Size(28, 36));
      final selectedPng = await rasterizeWidget(const MapPin(state: PinState.selected), context: context, logicalSize: const Size(38, 48));
      final closedPng = await rasterizeWidget(const MapPin(state: PinState.closed), context: context, logicalSize: const Size(28, 36));

      await _mapController!.addImage('pin-available', availablePng);
      await _mapController!.addImage('pin-selected', selectedPng);
      await _mapController!.addImage('pin-closed', closedPng);

      _updateSymbols();
    } catch (e) {
      debugPrint("Error loading marker images: \$e");
    }
  }

  void _updateSymbols() {
    if (_mapController == null || !_mapStyleLoaded) return;
    _mapController!.clearSymbols();

    final rooms = [demoSelectedRoom, ...demoNearbyRooms];

    for (var room in rooms) {
      String iconImage = room.isOpen ? 'pin-available' : 'pin-closed';
      if (_selectedRoomId == room.id) {
        iconImage = 'pin-selected';
      }

      _mapController!.addSymbol(
        SymbolOptions(
          geometry: room.position,
          iconImage: iconImage,
          iconAnchor: 'bottom',
        ),
        {'roomId': room.id}
      );
    }
  }

  Future<void> _locateUser() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Layanan lokasi tidak aktif.')));
      return;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Izin lokasi ditolak.')));
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Izin lokasi ditolak permanen.')));
      return;
    }

    final position = await Geolocator.getCurrentPosition();
    setState(() {
      _userLocation = LatLng(position.latitude, position.longitude);
    });

    _mapController?.animateCamera(CameraUpdate.newCameraPosition(
      CameraPosition(target: _userLocation!, zoom: 15, tilt: 35)
    ));
  }

  void _showLegend() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          left: 16, right: 16, top: 16,
          bottom: MediaQuery.paddingOf(context).bottom + 16,
        ),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(AppRadius.cardLg),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Legenda Peta', style: AppTypography.nunito(fontSize: 16, fontWeight: FontWeight.w800)),
              const SizedBox(height: 14),
              _legendRow(AppColors.primary, 'Ruang laktasi tersedia'),
              const SizedBox(height: 10),
              _legendRow(AppColors.primaryPressed, 'Sedang dipilih'),
              const SizedBox(height: 10),
              _legendRow(AppColors.pinClosed, 'Tutup / tidak tersedia'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _legendRow(Color color, String label) {
    return Row(
      children: [
        Container(width: 14, height: 14, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        const SizedBox(width: 10),
        Text(label, style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.body)),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final topInset = MediaQuery.paddingOf(context).top;
    final searchTop = topInset + 12;
    final variant = _sheetVariant;
    final sheetHeight = RoomBottomSheet.heightFor(variant);
    final actionsBottom = sheetHeight + 98;

    final room = _selectedRoom;

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.dark.copyWith(statusBarColor: Colors.transparent),
      child: Scaffold(
        backgroundColor: AppColors.mapLand,
        body: Stack(
          children: [
            if (_mapError || !_mapStyleLoaded)
              const Positioned.fill(child: WarmMapBackground()),

            Positioned.fill(
              child: MapLibreMap(
                initialCameraPosition: const CameraPosition(
                  target: LatLng(-6.1935, 106.8230),
                  zoom: 15,
                  tilt: 35,
                ),
                styleString: 'assets/map_style_momspace.json',
                myLocationEnabled: false,
                compassEnabled: false,
                rotateGesturesEnabled: true,
                onMapCreated: (controller) {
                  _mapController = controller;
                  controller.onSymbolTapped.add((symbol) {
                    final roomId = symbol.data?['roomId'] as String?;
                    if (roomId != null) {
                      _selectRoom(roomId);
                    }
                  });
                },
                onStyleLoadedCallback: () {
                  setState(() => _mapStyleLoaded = true);
                  _loadMarkerImages();
                },
              ),
            ),

            if (_userLocation != null) const SizedBox.shrink(),

            Positioned(
              top: searchTop,
              left: 14,
              right: 14,
              child: SearchPill(
                onTap: widget.onSearchTap,
                onFilterTap: widget.onSearchTap,
              ),
            ),
            Positioned(
              right: 14,
              bottom: actionsBottom,
              child: FloatingMapActions(
                onLayersTap: _showLegend,
                onLocateTap: _locateUser,
              ),
            ),
            Positioned(
              left: 0,
              right: 0,
              bottom: 88,
              child: ListenableBuilder(
                listenable: RoomRepository.instance,
                builder: (context, _) => RoomBottomSheet(
                  variant: variant,
                  selectedRoom: room ?? demoSelectedRoom,
                  nearbyRooms: demoNearbyRooms,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../data/demo_rooms.dart';
import '../theme/app_colors.dart';
import '../widgets/home_map/floating_map_actions.dart';
import '../widgets/home_map/map_pin.dart';
import '../widgets/home_map/room_bottom_sheet.dart';
import '../widgets/home_map/search_pill.dart';
import '../widgets/home_map/user_location_dot.dart';
import '../widgets/home_map/warm_map_background.dart';
import '../widgets/nav/classic_pill_navbar.dart';

/// Fixed decorative pin layout, copied verbatim from home-map.jsx `MapWorld`.
/// (x%, y%) are percentages of the full screen; the schematic map itself
/// is a placeholder per the handoff — production should back this with a
/// real map SDK and real coordinates.
class _PinSpec {
  const _PinSpec(this.x, this.y, this.state);
  final double x;
  final double y;
  final PinState state;
}

const List<_PinSpec> _decorativePins = [
  _PinSpec(28, 36, PinState.available),
  _PinSpec(72, 32, PinState.available),
  _PinSpec(36, 62, PinState.closed),
  _PinSpec(78, 62, PinState.available),
  _PinSpec(20, 70, PinState.available),
  _PinSpec(62, 78, PinState.closed),
];

/// MomSpace Home / Map — the app's main screen. Source: README.md § 2,
/// home-map.jsx `HomeMapScreen`.
class HomeMapScreen extends StatefulWidget {
  const HomeMapScreen({super.key});

  @override
  State<HomeMapScreen> createState() => _HomeMapScreenState();
}

class _HomeMapScreenState extends State<HomeMapScreen> {
  int _activeTab = 0;
  String? _selectedRoomId;
  bool _loadingSelection = false;

  SheetVariant get _sheetVariant {
    if (_loadingSelection) return SheetVariant.loading;
    return _selectedRoomId == null ? SheetVariant.empty : SheetVariant.defaultRoom;
  }

  Future<void> _selectRoom(String id) async {
    setState(() => _loadingSelection = true);
    await Future<void>.delayed(const Duration(milliseconds: 450));
    if (!mounted) return;
    setState(() {
      _selectedRoomId = id;
      _loadingSelection = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final topInset = MediaQuery.paddingOf(context).top;
    final searchTop = topInset + 12;
    final variant = _sheetVariant;
    final sheetHeight = RoomBottomSheet.heightFor(variant);
    // Mirrors the handoff's fixed floating-action offsets (sheet height +
    // an ~88px navbar allowance + a 10px gap).
    final actionsBottom = sheetHeight + 98;

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.dark.copyWith(
        statusBarColor: Colors.transparent,
      ),
      child: Scaffold(
        backgroundColor: AppColors.mapLand,
        body: Stack(
          children: [
            const Positioned.fill(child: WarmMapBackground()),
            Positioned.fill(
              child: _MapWorld(
                heroSelected: variant == SheetVariant.defaultRoom,
                onHeroTap: () => _selectRoom(demoSelectedRoom.id),
              ),
            ),
            Positioned(
              top: searchTop,
              left: 14,
              right: 14,
              child: const SearchPill(),
            ),
            Positioned(
              right: 14,
              bottom: actionsBottom,
              child: const FloatingMapActions(),
            ),
            Positioned(
              left: 0,
              right: 0,
              bottom: 88,
              child: RoomBottomSheet(
                variant: variant,
                selectedRoom: demoSelectedRoom,
                nearbyRooms: demoNearbyRooms,
              ),
            ),
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: ClassicPillNavBar(
                activeIndex: _activeTab,
                onChanged: (i) => setState(() => _activeTab = i),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MapWorld extends StatelessWidget {
  const _MapWorld({required this.heroSelected, required this.onHeroTap});

  final bool heroSelected;
  final VoidCallback onHeroTap;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        Offset px(double xPct, double yPct) => Offset(
              constraints.maxWidth * xPct / 100,
              constraints.maxHeight * yPct / 100,
            );

        Widget anchored({
          required double xPct,
          required double yPct,
          required Offset translation,
          required Widget child,
        }) {
          final pos = px(xPct, yPct);
          return Positioned(
            left: pos.dx,
            top: pos.dy,
            child: FractionalTranslation(translation: translation, child: child),
          );
        }

        return Stack(
          children: [
            for (final pin in _decorativePins)
              anchored(
                xPct: pin.x,
                yPct: pin.y,
                translation: const Offset(-0.5, -1),
                child: MapPin(state: pin.state),
              ),
            anchored(
              xPct: 52,
              yPct: 48,
              translation: const Offset(-0.5, -1),
              child: GestureDetector(
                onTap: onHeroTap,
                child: MapPin(state: heroSelected ? PinState.selected : PinState.available),
              ),
            ),
            anchored(
              xPct: 45,
              yPct: 66,
              translation: const Offset(-0.5, -0.5),
              child: const UserLocationDot(),
            ),
          ],
        );
      },
    );
  }
}

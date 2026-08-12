import 'package:flutter/material.dart';

import 'home_map_screen.dart';
import 'profile_screen.dart';
import 'search_screen.dart';
import '../models/room.dart';
import '../widgets/nav/classic_pill_navbar.dart';
import '../widgets/report_hub_sheet.dart';

class RootShell extends StatefulWidget {
  const RootShell({super.key});

  @override
  State<RootShell> createState() => _RootShellState();
}

class _RootShellState extends State<RootShell> {
  int _activeTab = 0;
  Room? _selectedRoom;

  void _onTabChanged(int index) {
    if (index == 2) {
      // Report tab opens bottom sheet, pre-filled with the currently
      // selected map room if there is one.
      showReportHubSheet(context, contextRoom: _selectedRoom);
    } else {
      setState(() => _activeTab = index);
    }
  }

  @override
  Widget build(BuildContext context) {
    // Map index to IndexedStack: Map(0) -> 0, Search(1) -> 1, Profile(3) -> 2
    int stackIndex = 0;
    if (_activeTab == 1) stackIndex = 1;
    if (_activeTab == 3) stackIndex = 2;

    return Scaffold(
      body: Stack(
        children: [
          IndexedStack(
            index: stackIndex,
            children: [
              HomeMapScreen(
                onRoomSelected: (room) => _selectedRoom = room,
                onSearchTap: () => setState(() => _activeTab = 1),
              ),
              const SearchScreen(),
              const ProfileScreen(),
            ],
          ),
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: ClassicPillNavBar(
              activeIndex: _activeTab,
              onChanged: _onTabChanged,
            ),
          ),
        ],
      ),
    );
  }
}

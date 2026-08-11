import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import '../theme/app_typography.dart';
import '../widgets/nav/classic_pill_navbar.dart';
import 'home_map_screen.dart';
import '../widgets/report_hub_sheet.dart';

class RootShell extends StatefulWidget {
  const RootShell({super.key});

  @override
  State<RootShell> createState() => _RootShellState();
}

class _RootShellState extends State<RootShell> {
  int _activeTab = 0;

  void _onTabChanged(int index) {
    if (index == 2) {
      // Report tab opens bottom sheet
      showReportHubSheet(context);
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
            children: const [
              HomeMapScreen(),
              PlaceholderScreen(title: 'Pencarian'),
              PlaceholderScreen(title: 'Profil'),
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

class PlaceholderScreen extends StatelessWidget {
  final String title;
  const PlaceholderScreen({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(title, style: AppTypography.screenTitle),
            const SizedBox(height: 16),
            Text('Segera hadir', style: AppTypography.quicksand(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textFaint)),
            const SizedBox(height: 32),
            Icon(Icons.construction_rounded, size: 64, color: AppColors.primaryTint),
          ],
        ),
      ),
    );
  }
}

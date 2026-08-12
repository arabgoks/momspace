import 'package:flutter/material.dart';

import '../data/repository.dart';
import '../models/location_submission.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';

class SubmitLocationScreen extends StatefulWidget {
  const SubmitLocationScreen({super.key});

  @override
  State<SubmitLocationScreen> createState() => _SubmitLocationScreenState();
}

class _SubmitLocationScreenState extends State<SubmitLocationScreen> {
  final _nameController = TextEditingController();
  final _floorController = TextEditingController();
  final List<String> _selectedFacilities = [];
  
  final List<String> _facilities = ['Bersih', 'Wastafel', 'AC', 'Kulkas', 'Stopkontak', 'Privasi', 'Stroller'];

  Future<void> _submit() async {
    if (_nameController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Nama tempat wajib diisi.')));
      return;
    }
    await RoomRepository.instance.addSubmission(
      LocationSubmission(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        name: _nameController.text,
        address: _floorController.text,
        latitude: 0,
        longitude: 0,
        category: 'Lainnya',
        facilities: _selectedFacilities,
        timestamp: DateTime.now(),
      ),
    );
    if (!mounted) return;
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Lokasi berhasil diusulkan. Terima kasih!')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        iconTheme: const IconThemeData(color: AppColors.ink),
        title: Text('Tambah Lokasi Baru', style: AppTypography.nunito(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.ink)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Nama Tempat', style: AppTypography.nunito(fontSize: 16, fontWeight: FontWeight.w800)),
            const SizedBox(height: 8),
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                hintText: 'Misal: Mall Kelapa Gading',
                hintStyle: AppTypography.quicksand(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textFaint),
                filled: true,
                fillColor: AppColors.surfaceSand,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 24),
            Text('Lantai / Detail Lokasi', style: AppTypography.nunito(fontSize: 16, fontWeight: FontWeight.w800)),
            const SizedBox(height: 8),
            TextField(
              controller: _floorController,
              decoration: InputDecoration(
                hintText: 'Misal: Lt. 2 dekat toilet wanita',
                hintStyle: AppTypography.quicksand(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textFaint),
                filled: true,
                fillColor: AppColors.surfaceSand,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 24),
            Text('Titik Peta', style: AppTypography.nunito(fontSize: 16, fontWeight: FontWeight.w800)),
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              height: 120,
              decoration: BoxDecoration(
                color: AppColors.mapLand,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.divider),
              ),
              child: const Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.location_on, color: AppColors.primary, size: 32),
                    SizedBox(height: 8),
                    Text('Lokasi saat ini dipilih', style: TextStyle(color: AppColors.body)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            Text('Fasilitas Tersedia', style: AppTypography.nunito(fontSize: 16, fontWeight: FontWeight.w800)),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _facilities.map((c) {
                final isSelected = _selectedFacilities.contains(c);
                return ChoiceChip(
                  label: Text(c, style: AppTypography.quicksand(fontSize: 14, fontWeight: FontWeight.w700, color: isSelected ? Colors.white : AppColors.ink)),
                  selected: isSelected,
                  selectedColor: AppColors.primary,
                  backgroundColor: AppColors.surfaceSand,
                  onSelected: (val) {
                    setState(() {
                      if (val) _selectedFacilities.add(c);
                      else _selectedFacilities.remove(c);
                    });
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 48),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.sageDk,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                  elevation: 0,
                ),
                child: Text('Kirim Usulan', style: AppTypography.nunito(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white)),
              ),
            )
          ],
        ),
      ),
    );
  }
}

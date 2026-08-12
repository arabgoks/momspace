import 'package:flutter/material.dart';

import '../data/repository.dart';
import '../models/condition_report.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';
import '../widgets/home_map/rating_star.dart';

class ReportConditionScreen extends StatefulWidget {
  const ReportConditionScreen({super.key});

  @override
  State<ReportConditionScreen> createState() => _ReportConditionScreenState();
}

class _ReportConditionScreenState extends State<ReportConditionScreen> {
  int _rating = 0;
  final List<String> _selectedConditions = [];
  final TextEditingController _noteController = TextEditingController();

  final List<String> _conditions = ['Bersih', 'Wastafel berfungsi', 'AC dingin', 'Sabun habis', 'Kotor', 'Ruang penuh'];

  Future<void> _submit() async {
    if (_rating == 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Mohon berikan rating (bintang).')));
      return;
    }
    await RoomRepository.instance.addReport(
      ConditionReport(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        roomId: 'unknown',
        roomName: 'Unknown',
        conditions: _selectedConditions,
        notes: _noteController.text,
        timestamp: DateTime.now(),
      ),
    );
    if (!mounted) return;
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Laporan berhasil dikirim. Terima kasih! (+10 poin)')),
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
        title: Text('Laporan Kondisi Ruang', style: AppTypography.nunito(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.ink)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Penilaian Ruangan', style: AppTypography.nunito(fontSize: 16, fontWeight: FontWeight.w800)),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(5, (index) {
                return GestureDetector(
                  onTap: () => setState(() => _rating = index + 1),
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: RatingStar(size: 32, empty: index >= _rating),
                  ),
                );
              }),
            ),
            const SizedBox(height: 32),
            Text('Kondisi Fasilitas', style: AppTypography.nunito(fontSize: 16, fontWeight: FontWeight.w800)),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _conditions.map((c) {
                final isSelected = _selectedConditions.contains(c);
                return ChoiceChip(
                  label: Text(c, style: AppTypography.quicksand(fontSize: 14, fontWeight: FontWeight.w700, color: isSelected ? Colors.white : AppColors.ink)),
                  selected: isSelected,
                  selectedColor: AppColors.primary,
                  backgroundColor: AppColors.surfaceSand,
                  onSelected: (val) {
                    setState(() {
                      if (val) _selectedConditions.add(c);
                      else _selectedConditions.remove(c);
                    });
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 32),
            Text('Catatan Tambahan', style: AppTypography.nunito(fontSize: 16, fontWeight: FontWeight.w800)),
            const SizedBox(height: 12),
            TextField(
              controller: _noteController,
              maxLines: 4,
              decoration: InputDecoration(
                hintText: 'Misal: Ruangannya agak panas...',
                hintStyle: AppTypography.quicksand(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textFaint),
                filled: true,
                fillColor: AppColors.surfaceSand,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 48),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                  elevation: 0,
                ),
                child: Text('Kirim Laporan', style: AppTypography.nunito(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white)),
              ),
            )
          ],
        ),
      ),
    );
  }
}

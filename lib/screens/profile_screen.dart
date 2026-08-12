import 'package:flutter/material.dart';

import '../data/app_session.dart';
import '../data/repository.dart';
import '../models/condition_report.dart';
import '../models/location_submission.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';
import '../widgets/profile/submission_status_pill.dart';
import 'login_screen.dart';

/// Points, contribution history, and guest/login state.
/// No pixel mockup exists for this screen in design_handoff_momspace/ —
/// styled from the existing token system.
class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  Future<void> _openLogin() async {
    await Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
  }

  String _relativeTime(DateTime time) {
    final diff = DateTime.now().difference(time);
    if (diff.inMinutes < 1) return 'Baru saja';
    if (diff.inMinutes < 60) return '${diff.inMinutes} menit lalu';
    if (diff.inHours < 24) return '${diff.inHours} jam lalu';
    return '${diff.inDays} hari lalu';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SafeArea(
        child: ListenableBuilder(
          listenable: AppSession.instance,
          builder: (context, _) {
            final loggedIn = AppSession.instance.displayLabel != null;
            return ListenableBuilder(
              listenable: RoomRepository.instance,
              builder: (context, __) {
                final repo = RoomRepository.instance;
                return ListView(
                  padding: const EdgeInsets.fromLTRB(AppSpacing.s18, AppSpacing.s18, AppSpacing.s18, 88 + AppSpacing.s24),
                  children: [
                    Text('Profil', style: AppTypography.screenTitle),
                    const SizedBox(height: 20),
                    _buildIdentityCard(loggedIn),
                    const SizedBox(height: 16),
                    if (!loggedIn) ...[
                      _buildGuestPromptCard(),
                      const SizedBox(height: 16),
                    ],
                    _buildPointsCard(repo.rewardPoints),
                    const SizedBox(height: 24),
                    Text('Riwayat Laporan', style: AppTypography.nunito(fontSize: 15, fontWeight: FontWeight.w800)),
                    const SizedBox(height: 12),
                    if (repo.reports.isEmpty)
                      _buildEmptyState('Belum ada laporan kondisi yang kamu kirim.')
                    else
                      for (final report in repo.reports) ...[
                        _buildReportTile(report),
                        const SizedBox(height: 8),
                      ],
                    const SizedBox(height: 24),
                    Text('Riwayat Lokasi Diusulkan', style: AppTypography.nunito(fontSize: 15, fontWeight: FontWeight.w800)),
                    const SizedBox(height: 12),
                    if (repo.submissions.isEmpty)
                      _buildEmptyState('Belum ada lokasi yang kamu usulkan.')
                    else
                      for (final submission in repo.submissions) ...[
                        _buildSubmissionTile(submission),
                        const SizedBox(height: 8),
                      ],
                    if (loggedIn) ...[
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        child: OutlinedButton(
                          onPressed: () => AppSession.instance.logOut(),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: AppColors.dividerStrong),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                          ),
                          child: Text('Keluar', style: AppTypography.nunito(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.body)),
                        ),
                      ),
                    ],
                  ],
                );
              },
            );
          },
        ),
      ),
    );
  }

  Widget _buildIdentityCard(bool loggedIn) {
    final label = AppSession.instance.displayLabel ?? 'Mode Tamu';
    final initial = loggedIn ? label.substring(0, 1).toUpperCase() : 'T';
    return Row(
      children: [
        Container(
          width: 56,
          height: 56,
          decoration: const BoxDecoration(gradient: LinearGradient(colors: [AppColors.primary, AppColors.rose03]), shape: BoxShape.circle),
          alignment: Alignment.center,
          child: Text(initial, style: AppTypography.nunito(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white)),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: AppTypography.nunito(fontSize: 16, fontWeight: FontWeight.w800), overflow: TextOverflow.ellipsis),
              Text(
                loggedIn ? 'Akun MomSpace' : 'Menjelajah tanpa akun',
                style: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textFaint),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildGuestPromptCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.primaryTint,
        borderRadius: BorderRadius.circular(AppRadius.cardLg),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Kamu sedang menjelajah sebagai Tamu', style: AppTypography.nunito(fontSize: 14, fontWeight: FontWeight.w800)),
          const SizedBox(height: 4),
          Text(
            'Masuk untuk menyimpan poin dan riwayat kontribusimu di perangkat lain.',
            style: AppTypography.quicksand(fontSize: 12.5, fontWeight: FontWeight.w600, color: AppColors.body),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _openLogin,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
                elevation: 0,
              ),
              child: Text('Masuk / Daftar', style: AppTypography.nunito(fontSize: 13.5, fontWeight: FontWeight.w800, color: Colors.white)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPointsCard(int points) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(color: AppColors.surfaceSand, borderRadius: BorderRadius.circular(AppRadius.cardLg)),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [AppColors.primary, AppColors.primaryPressed]),
              borderRadius: BorderRadius.circular(14),
            ),
            alignment: Alignment.center,
            child: const Icon(Icons.star_rounded, color: Colors.white, size: 24),
          ),
          const SizedBox(width: 14),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('$points', style: AppTypography.dashboardStat),
              Text('poin kontribusi', style: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textFaint)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(String message) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: AppColors.surfaceSand, borderRadius: BorderRadius.circular(14)),
      child: Text(message, style: AppTypography.quicksand(fontSize: 12.5, fontWeight: FontWeight.w600, color: AppColors.textFaint)),
    );
  }

  Widget _buildReportTile(ConditionReport report) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: AppColors.surfaceSand, borderRadius: BorderRadius.circular(14)),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.fact_check_outlined, color: AppColors.primaryPressed, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(report.roomName, style: AppTypography.nunito(fontSize: 13, fontWeight: FontWeight.w800)),
                const SizedBox(height: 2),
                Text(
                  '${report.conditions.join(', ')} · ${_relativeTime(report.timestamp)}',
                  style: AppTypography.quicksand(fontSize: 11.5, fontWeight: FontWeight.w600, color: AppColors.textFaint),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSubmissionTile(LocationSubmission submission) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: AppColors.surfaceSand, borderRadius: BorderRadius.circular(14)),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.add_location_alt_outlined, color: AppColors.sageDk, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(submission.name, style: AppTypography.nunito(fontSize: 13, fontWeight: FontWeight.w800)),
                const SizedBox(height: 2),
                Text(_relativeTime(submission.timestamp), style: AppTypography.quicksand(fontSize: 11.5, fontWeight: FontWeight.w600, color: AppColors.textFaint)),
              ],
            ),
          ),
          SubmissionStatusPill(status: submission.status),
        ],
      ),
    );
  }
}

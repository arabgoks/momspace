import 'package:flutter/material.dart';

import '../data/app_session.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';

/// Simple, fresh-designed login/guest-mode screen — no pixel mockup exists
/// for this in design_handoff_momspace/. There is no backend: "Masuk"
/// performs local-only validation and sets [AppSession].
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  String? _error;

  bool get _canSubmit =>
      _emailController.text.contains('@') && _passwordController.text.length >= 6;

  void _submit() {
    if (!_canSubmit) {
      setState(() => _error = 'Masukkan email valid dan kata sandi minimal 6 karakter.');
      return;
    }
    AppSession.instance.logIn(_emailController.text.trim());
    Navigator.pop(context);
  }

  void _continueAsGuest() => Navigator.pop(context);

  void _showRegisterUnavailable() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Registrasi belum tersedia di versi ini.')),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.s24, vertical: AppSpacing.s24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 24),
              Center(
                child: Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [AppColors.primary, AppColors.primaryPressed]),
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(color: AppColors.primary.withValues(alpha: 0.4), offset: const Offset(0, 10), blurRadius: 22),
                    ],
                  ),
                  alignment: Alignment.center,
                  child: Text('M', style: AppTypography.nunito(fontSize: 34, fontWeight: FontWeight.w900, color: Colors.white)),
                ),
              ),
              const SizedBox(height: 16),
              Center(child: Text('MomSpace', style: AppTypography.nunito(fontSize: 24, fontWeight: FontWeight.w900, letterSpacing: -0.3))),
              const SizedBox(height: 6),
              Center(
                child: Text(
                  'Platform ruang laktasi pintar untuk Jakarta',
                  textAlign: TextAlign.center,
                  style: AppTypography.quicksand(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textMuted),
                ),
              ),
              const SizedBox(height: 36),
              Text('Email', style: AppTypography.nunito(fontSize: 13, fontWeight: FontWeight.w800)),
              const SizedBox(height: 8),
              TextField(
                key: const Key('loginEmailField'),
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                  hintText: 'nama@email.com',
                  hintStyle: AppTypography.quicksand(fontSize: 13.5, fontWeight: FontWeight.w600, color: AppColors.placeholder),
                  filled: true,
                  fillColor: AppColors.surfaceSand,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 18),
              Text('Kata Sandi', style: AppTypography.nunito(fontSize: 13, fontWeight: FontWeight.w800)),
              const SizedBox(height: 8),
              TextField(
                key: const Key('loginPasswordField'),
                controller: _passwordController,
                obscureText: true,
                decoration: InputDecoration(
                  hintText: 'Minimal 6 karakter',
                  hintStyle: AppTypography.quicksand(fontSize: 13.5, fontWeight: FontWeight.w600, color: AppColors.placeholder),
                  filled: true,
                  fillColor: AppColors.surfaceSand,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                ),
              ),
              if (_error != null) ...[
                const SizedBox(height: 10),
                Text(_error!, style: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.primaryDeep)),
              ],
              const SizedBox(height: 24),
              SizedBox(
                height: 52,
                child: ElevatedButton(
                  onPressed: _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(26)),
                    elevation: 0,
                  ),
                  child: Text('Masuk', style: AppTypography.nunito(fontSize: 15, fontWeight: FontWeight.w800, color: Colors.white)),
                ),
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  const Expanded(child: Divider(color: AppColors.divider)),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: Text('atau', style: AppTypography.quicksand(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textFaint)),
                  ),
                  const Expanded(child: Divider(color: AppColors.divider)),
                ],
              ),
              const SizedBox(height: 14),
              SizedBox(
                height: 52,
                child: OutlinedButton(
                  onPressed: _continueAsGuest,
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.dividerStrong),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(26)),
                  ),
                  child: Text('Lanjutkan sebagai Tamu', style: AppTypography.nunito(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.ink)),
                ),
              ),
              const SizedBox(height: 24),
              Center(
                child: GestureDetector(
                  onTap: _showRegisterUnavailable,
                  child: RichText(
                    text: TextSpan(
                      style: AppTypography.quicksand(fontSize: 12.5, fontWeight: FontWeight.w600, color: AppColors.textFaint),
                      children: [
                        const TextSpan(text: 'Belum punya akun? '),
                        TextSpan(text: 'Daftar', style: TextStyle(color: AppColors.primaryPressed, fontWeight: FontWeight.w800)),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

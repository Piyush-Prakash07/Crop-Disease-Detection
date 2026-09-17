import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Upload, Cpu, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#080b11] overflow-x-hidden">
      {/* Premium Header */}
      <header className="glass-panel sticky top-0 z-40 w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sprout className="w-8 h-8 text-emerald-400" />
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
            AgriGuard
          </span>
        </div>
        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/50 hover:brightness-105 transition-all text-sm"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 transition-all text-sm"
              >
                Join Now
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 max-w-5xl mx-auto z-10 animate-fade-in-up">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-emerald-950/20 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6 uppercase tracking-wider">
          <Award className="w-4 h-4" /> AI-Powered Crop Protection
        </div>
        
        <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          Detect Crop Disease <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
            Instantly
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-light">
          Protect your harvest with state-of-the-art MobileNetV2 computer vision model. Upload crop leaf photos and get precision treatment recommendations in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-lg shadow-xl shadow-emerald-900/30 hover:shadow-emerald-900/50 hover:brightness-105 hover:translate-y-[-1px] active:translate-y-0 transition-all cursor-pointer"
          >
            Start Analyzing <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/5 transition-all text-lg"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 md:py-28 bg-[#0b0f19]/70 relative border-t border-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 text-md md:text-lg max-w-xl mx-auto font-light">
              Get detailed plant disease diagnostics in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Steps */}
            <div className="glass-card p-8 rounded-2xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1. Upload Image</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Take a clear photo of the infected crop leaf and drag-and-drop it into the dashboard.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">2. Deep AI Analysis</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Our MobileNetV2 neural network scans the image patterns to identify potential pathogens.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">3. Actionable Results</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Instantly view the disease name, causes, symptoms, and specific treatment suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="text-emerald-400 font-bold uppercase tracking-wider text-sm">Empowering Modern Farmers</div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              A complete diagnostic tool built for field use
            </h2>
            <p className="text-gray-400 font-light leading-relaxed text-lg">
              Say goodbye to guesswork. AgriGuard is configured to identify 15 separate healthy and diseased classes across crops like tomato, potato, and bell pepper.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mt-1 shrink-0">
                  <span className="text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">91% Model Accuracy</h4>
                  <p className="text-sm text-gray-400">Tested and validated on over thousands of training samples.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mt-1 shrink-0">
                  <span className="text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Historical Logs</h4>
                  <p className="text-sm text-gray-400">Keep track of prior scans and track patterns over time.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mt-1 shrink-0">
                  <span className="text-xs">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Treatment Prescriptions</h4>
                  <p className="text-sm text-gray-400">Get organic prevention practices and chemical remedies directly.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-2xl -z-10" />
            <div className="glass-card p-6 rounded-3xl border border-gray-800">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-xs text-gray-500 font-mono">agri_model_val.py</div>
              </div>
              <div className="space-y-4 font-mono text-sm text-emerald-400/90">
                <div>&gt;&gt;&gt; import model_service</div>
                <div>&gt;&gt;&gt; model_service.eval_model()</div>
                <div className="text-gray-400 pl-4">Loading MobileNetV2 weights... OK</div>
                <div className="text-gray-400 pl-4">Running verification on PlantVillage subset...</div>
                <div className="text-teal-300 font-bold pl-4">Validation Accuracy: 91.43%</div>
                <div className="text-teal-300 font-bold pl-4">F1 Score: 0.9128</div>
                <div>&gt;&gt;&gt; model_service.get_classes()</div>
                <div className="text-gray-500 text-xs pl-4">[ 'Tomato_Early_blight', 'Potato_Late_blight', 'Pepper_bell_healthy', ... 15 classes ]</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#06080d] border-t border-gray-900 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} AgriGuard. Premium Agricultural AI Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
}

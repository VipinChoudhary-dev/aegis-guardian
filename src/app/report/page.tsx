'use client';

import { useState, useEffect } from 'react';
import { FileText, Upload, MapPin, Calendar, Phone, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { Navbar } from '@/components/Navbar';
import { motion } from 'framer-motion';

export default function ReportPage() {
  const { address } = useAccount();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    name: '',
    phone: '',
    date: '',
    time: '',
    images: [] as string[]
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        }
      );
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setFormData({ ...formData, images: [...formData.images, ...newImages] });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const report = {
      ...formData,
      location,
      walletId: address || 'Not connected',
      timestamp: new Date().toISOString(),
      reportId: `FIR-${Date.now()}`
    };

    console.log('e-FIR Submitted:', report);
    localStorage.setItem(`fir-${report.reportId}`, JSON.stringify(report));
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        type: '',
        description: '',
        name: '',
        phone: '',
        date: '',
        time: '',
        images: []
      });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full mb-6 shadow-2xl">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="neon-text-red">Report</span>{' '}
            <span className="neon-text-yellow">e-FIR</span>
          </h1>
          <p className="text-gray-400">File your complaint online - Fast & Secure</p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-900/30 border-2 border-green-500 rounded-2xl p-12 text-center"
          >
            <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">FIR Submitted Successfully!</h2>
            <p className="text-green-200 mb-6">Your report has been registered. Authorities will contact you soon.</p>
            <div className="bg-green-800/30 rounded-lg p-4 inline-block">
              <p className="text-sm text-green-300">Reference ID: FIR-{Date.now()}</p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-purple-800/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-600/50 shadow-2xl"
          >
            {/* Incident Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-purple-200 mb-2">Incident Type *</label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 bg-purple-700/50 border border-purple-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
              >
                <option value="">Select incident type</option>
                <option value="theft">Theft</option>
                <option value="assault">Assault</option>
                <option value="harassment">Harassment</option>
                <option value="fraud">Fraud</option>
                <option value="accident">Accident</option>
                <option value="missing">Missing Person</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Personal Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Your Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-purple-300" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-purple-700/50 border border-purple-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-purple-300"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-5 w-5 text-purple-300" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-purple-700/50 border border-purple-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-purple-300"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Date of Incident *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-purple-300" />
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-purple-700/50 border border-purple-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Time of Incident *</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 bg-purple-700/50 border border-purple-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-purple-200 mb-2">Detailed Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 bg-purple-700/50 border border-purple-500 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-purple-300 resize-none"
                placeholder="Describe the incident in detail..."
              />
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-purple-200 mb-2">Upload Evidence (Photos)</label>
              <div className="border-2 border-dashed border-purple-500 rounded-lg p-8 text-center hover:border-yellow-500 transition-colors">
                <Upload className="h-12 w-12 text-purple-300 mx-auto mb-4" />
                <p className="text-purple-200 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-purple-300 mb-4">PNG, JPG up to 10MB</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer transition-colors"
                >
                  Choose Files
                </label>
              </div>
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {formData.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`Evidence ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            {location && (
              <div className="mb-6 bg-purple-700/30 rounded-lg p-4">
                <div className="flex items-center text-purple-200">
                  <MapPin className="h-5 w-5 mr-2 text-yellow-400" />
                  <span className="text-sm">
                    Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            )}

            {/* Wallet ID */}
            {address && (
              <div className="mb-6 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center text-green-300">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm">Digital ID: {address.substring(0, 10)}...{address.substring(address.length - 8)}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 hover:from-red-600 hover:via-yellow-600 hover:to-green-600 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-2xl"
            >
              Submit e-FIR
            </button>

            <p className="text-center text-sm text-purple-300 mt-4">
              Your report will be sent to local authorities immediately
            </p>
          </motion.form>
        )}
      </div>
      <Navbar />
    </div>
  );
}

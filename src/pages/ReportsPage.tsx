import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import { demoInstitutionalReports } from '../data/demoCohort';
import { InstitutionalReport } from '../types';
import { facultyService } from '../services/facultyService';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  FileText,
  Calendar,
  Sparkles,
  CheckCircle2,
  Share2,
  Plus,
  Clock,
  HardDrive,
  BarChart3,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { showToast } = useApp();
  const [reports, setReports] = useState<InstitutionalReport[]>(demoInstitutionalReports);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [generateModalOpen, setGenerateModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    facultyService.getReports().then((data) => {
      if (isMounted) setReports(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Custom report generator state
  const [reportTitle, setReportTitle] = useState('');
  const [reportCategory, setReportCategory] = useState<InstitutionalReport['category']>('Academic');
  const [reportFormat, setReportFormat] = useState<InstitutionalReport['format']>('PDF');

  const filteredReports = reports.filter((r) => {
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesFormat = selectedFormat === 'All' || r.format === selectedFormat;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.period.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesFormat && matchesSearch;
  });

  const handleDownload = (report: InstitutionalReport) => {
    facultyService.recordAuditLog('download_report', 'report', report.id, { title: report.title });
    // Increment download counter
    setReports((prev) =>
      prev.map((r) => (r.id === report.id ? { ...r, downloads: r.downloads + 1 } : r))
    );
    showToast(
      'Report Download Started',
      `Downloading "${report.title}" in ${report.format} format (${report.size}).`,
      'success'
    );
  };

  const handleGenerateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) {
      showToast('Validation Error', 'Please enter a report title.', 'error');
      return;
    }

    const newReport: InstitutionalReport = {
      id: `rep-${Date.now().toString().slice(-4)}`,
      title: reportTitle,
      category: reportCategory,
      generatedDate: 'Just now',
      period: 'Custom Date Range',
      format: reportFormat,
      size: reportFormat === 'PDF' ? '3.4 MB' : '1.2 MB',
      downloads: 1,
      description: `Generated automated institutional report for ${reportCategory} telemetry across ST² Student Growth Hub data pipelines.`,
    };

    setReports([newReport, ...reports]);
    showToast(
      'Report Compiled',
      `"${newReport.title}" successfully compiled and ready for download.`,
      'success'
    );
    setGenerateModalOpen(false);
    setReportTitle('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(255,122,24,0.30)] bg-gradient-to-r from-[#24130D]/95 via-[#1A120E]/90 to-[#100D0B]/95 p-6 backdrop-blur-xl shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF7A18]/20 border border-[#FF7A18]/40 text-[#FF8C32]">
                <FileSpreadsheet size={16} />
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#FF8C32]">
                Institutional Intelligence
              </span>
              <Badge variant="orange" size="sm">Audit Ready</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#FFF8F0] font-display tracking-tight">
              Reports & Accreditation Center
            </h1>
            <p className="text-sm text-[#C5B5A8] max-w-2xl mt-1">
              Download statutory compliance ledgers, semester-end performance dossiers, and NAAC/NBA criteria outcomes verified by ST² analytics.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setGenerateModalOpen(true)}
          >
            Generate Custom Audit
          </Button>
        </div>

        {/* Ambient lighting orb */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#FF7A18]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4 border-l-2 border-l-[#FF7A18]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#C5B5A8]">Audit Documents</span>
            <FileText size={16} className="text-[#FF7A18]" />
          </div>
          <p className="text-2xl font-black text-[#FFF8F0] font-display mt-2">{reports.length}</p>
          <p className="text-[11px] text-[#8F8176] mt-1">Available for Download</p>
        </GlassCard>

        <GlassCard className="p-4 border-l-2 border-l-[#FF8C32]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#C5B5A8]">Total Downloads</span>
            <Download size={16} className="text-[#FF8C32]" />
          </div>
          <p className="text-2xl font-black text-[#FFF8F0] font-display mt-2">
            {reports.reduce((acc, r) => acc + r.downloads, 0)}
          </p>
          <p className="text-[11px] text-[#10B981] mt-1">Faculty & Dean Access</p>
        </GlassCard>

        <GlassCard className="p-4 border-l-2 border-l-[#FFB347]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#C5B5A8]">Accreditation Ready</span>
            <Sparkles size={16} className="text-[#FFB347]" />
          </div>
          <p className="text-2xl font-black text-[#FFF8F0] font-display mt-2">NAAC / NBA</p>
          <p className="text-[11px] text-[#8F8176] mt-1">Outcome Based Education</p>
        </GlassCard>

        <GlassCard className="p-4 border-l-2 border-l-[#FFB347]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#C5B5A8]">Next Scheduled Audit</span>
            <Calendar size={16} className="text-[#FFB347]" />
          </div>
          <p className="text-2xl font-black text-[#FFF8F0] font-display mt-2">Oct 28</p>
          <p className="text-[11px] text-[#FF8C32] mt-1">Mid-Term Board Review</p>
        </GlassCard>
      </div>

      {/* Filter and Search */}
      <GlassCard className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F8176]"
            />
            <input
              type="text"
              placeholder="Search reports by title, period, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A120E] border border-[rgba(255,248,240,0.12)] rounded-xl pl-9 pr-4 py-2 text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#8F8176] shrink-0">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#1A120E] border border-[rgba(255,248,240,0.12)] rounded-lg px-2.5 py-1.5 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
            >
              <option value="All" className="bg-[#1A120E] text-[#FFF8F0]">All Categories</option>
              <option value="Academic" className="bg-[#1A120E] text-[#FFF8F0]">Academic</option>
              <option value="Attendance" className="bg-[#1A120E] text-[#FFF8F0]">Attendance</option>
              <option value="Placement" className="bg-[#1A120E] text-[#FFF8F0]">Placement</option>
              <option value="Interventions" className="bg-[#1A120E] text-[#FFF8F0]">Interventions</option>
              <option value="Accreditation" className="bg-[#1A120E] text-[#FFF8F0]">Accreditation</option>
            </select>

            <span className="text-[11px] font-semibold text-[#8F8176] shrink-0 ml-2">Format:</span>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="bg-[#1A120E] border border-[rgba(255,248,240,0.12)] rounded-lg px-2.5 py-1.5 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
            >
              <option value="All" className="bg-[#1A120E] text-[#FFF8F0]">All Formats</option>
              <option value="PDF" className="bg-[#1A120E] text-[#FFF8F0]">PDF</option>
              <option value="XLSX" className="bg-[#1A120E] text-[#FFF8F0]">XLSX</option>
              <option value="CSV" className="bg-[#1A120E] text-[#FFF8F0]">CSV</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((rep) => (
          <GlassCard
            key={rep.id}
            className="p-5 flex flex-col justify-between group hover:border-[rgba(255,122,24,0.40)] hover:shadow-[0_8px_25px_rgba(255,122,24,0.15)] transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <Badge
                  variant={
                    rep.category === 'Academic'
                      ? 'orange'
                      : rep.category === 'Attendance'
                      ? 'amber'
                      : rep.category === 'Placement'
                      ? 'orange'
                      : rep.category === 'Accreditation'
                      ? 'amber'
                      : 'green'
                  }
                  size="sm"
                >
                  {rep.category}
                </Badge>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#8F8176]">
                  <span className="px-1.5 py-0.5 rounded bg-[#1A120E] border border-[rgba(255,122,24,0.30)] text-[#FFB347] font-bold">
                    {rep.format}
                  </span>
                  <span>{rep.size}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-[#FFF8F0] group-hover:text-[#FF8C32] transition-colors leading-snug">
                {rep.title}
              </h3>

              <p className="text-xs text-[#8F8176] mt-2 leading-relaxed">
                {rep.description}
              </p>

              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[rgba(255,248,240,0.06)] text-[11px] text-[#8F8176]">
                <span>Period: <strong className="text-[#C5B5A8]">{rep.period}</strong></span>
                <span>Date: <strong className="text-[#C5B5A8]">{rep.generatedDate}</strong></span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-3">
              <span className="text-[11px] text-[#8F8176]">
                <strong className="text-[#C5B5A8]">{rep.downloads}</strong> downloads logged
              </span>

              <Button
                variant="primary"
                size="sm"
                icon={<Download size={13} />}
                onClick={() => handleDownload(rep)}
              >
                Download {rep.format}
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Custom Report Compilation Modal */}
      <Modal
        isOpen={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        title="Generate Custom Institutional Audit"
      >
        <form onSubmit={handleGenerateCustom} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#C5B5A8] mb-1">
              Audit Report Title
            </label>
            <input
              type="text"
              required
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder="e.g., Department of Computing Mid-Term Attendance & Lab Review"
              className="w-full bg-[#1A120E] border border-[rgba(255,248,240,0.12)] rounded-xl px-3 py-2 text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#C5B5A8] mb-1">Analytics Domain</label>
              <select
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value as any)}
                className="w-full bg-[#1A120E] border border-[rgba(255,248,240,0.12)] rounded-xl px-2.5 py-2 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
              >
                <option value="Academic">Academic Progression</option>
                <option value="Attendance">Biometric Attendance</option>
                <option value="Placement">Placement Readiness</option>
                <option value="Interventions">Interventions & Risk</option>
                <option value="Accreditation">Accreditation Criteria</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C5B5A8] mb-1">Export Format</label>
              <select
                value={reportFormat}
                onChange={(e) => setReportFormat(e.target.value as any)}
                className="w-full bg-[#1A120E] border border-[rgba(255,248,240,0.12)] rounded-xl px-2.5 py-2 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
              >
                <option value="PDF">PDF (Formatted Dossier)</option>
                <option value="XLSX">Excel Spreadsheet (XLSX)</option>
                <option value="CSV">Raw Tabular (CSV)</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[rgba(255,248,240,0.03)] border border-[rgba(255,248,240,0.08)] text-[11px] text-[#C5B5A8]">
            Compiles live metrics from the ST² telemetry engine with cryptographic checksum for official submission.
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[rgba(255,248,240,0.08)]">
            <Button variant="outline" size="sm" type="button" onClick={() => setGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Compile & Export
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { 
    Download, 
    Trash2, 
    CheckCircle, 
    Filter, 
    Search, 
    ArrowRight,
    MessageCircle,
    User,
    Calendar,
    Phone,
    TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch, downloadFile } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const LEAD_TABLES = [
    { id: 'contact', name: 'General Contact', table: 'leads_contact' },
    { id: 'buy', name: 'Buying Help', table: 'leads_buy' },
    { id: 'sell', name: 'Selling Help', table: 'leads_sell' },
    { id: 'inspection', name: 'Inspections', table: 'leads_inspection' },
    { id: 'valuation', name: 'Valuations', table: 'leads_valuation' },
    { id: 'comparison', name: 'Comparisons', table: 'leads_comparison' },
    { id: 'vehicle_inquiry', name: 'Vehicle Inquiries', table: 'leads_vehicle_inquiry' },
    { id: 'waitlist', name: 'Waitlist', table: 'leads_waitlist' },
    { id: 'paperwork', name: 'Paperwork', table: 'leads_paperwork' },
    { id: 'technology', name: 'Technology', table: 'leads_technology' },
    { id: 'restoration', name: 'Restoration', table: 'leads_restoration' },
    { id: 'logistics', name: 'Logistics', table: 'leads_logistics' },
];

export default function AdminLeadsPage() {
    const [activeTable, setActiveTable] = useState(LEAD_TABLES[0]);
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchLeads();
    }, [activeTable]);

    async function fetchLeads() {
        setLoading(true);
        try {
            const res = await apiFetch(`/admin/leads/${activeTable.id}`);
            if (res.data) setLeads(res.data);
        } catch (err) {
            console.error('Failed to fetch leads');
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id: number, status: string) {
        try {
            await apiFetch(`/admin/leads/${activeTable.id}/${id}`, {
                method: 'PATCH',
                body: { status }
            });
            fetchLeads();
        } catch (err) {
            console.error('Failed to update status');
        }
    }

    async function deleteLead(id: number) {
        if (!confirm('Are you sure you want to delete this lead?')) return;
        try {
            await apiFetch(`/admin/leads/${activeTable.id}/${id}`, {
                method: 'DELETE'
            });
            fetchLeads();
        } catch (err) {
            console.error('Failed to delete lead');
        }
    }

    async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            // Using raw fetch for multipart/form-data because apiFetch might not handle it easily without modification
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE}/admin/leads/${activeTable.id}/import`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message);
                fetchLeads();
            } else {
                alert(data.message || 'Import failed');
            }
        } catch (err) {
            console.error('Import failed', err);
            alert('Import failed. Check console for details.');
        } finally {
            setLoading(false);
            e.target.value = ''; // Reset input
        }
    }

    const [showExportModal, setShowExportModal] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [selectedTables, setSelectedTables] = useState<string[]>([]);

    async function handleBulkExport() {
        if (selectedTables.length === 0) {
            alert('Please select at least one table to export.');
            return;
        }

        for (const tableId of selectedTables) {
            try {
                await downloadFile(`/admin/leads/${tableId}/export`, `export_${tableId}.csv`);
            } catch (err) {
                console.error(`Export failed for ${tableId}`);
            }
            // Small delay to prevent browser issues
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        setShowExportModal(false);
    }

    async function handleBulkTemplate() {
        if (selectedTables.length === 0) {
            alert('Please select at least one template to download.');
            return;
        }

        for (const tableId of selectedTables) {
            try {
                await downloadFile(`/admin/leads/${tableId}/template`, `template_${tableId}.csv`);
            } catch (err) {
                console.error(`Template download failed for ${tableId}`);
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        setShowTemplateModal(false);
    }

    const toggleTableSelection = (id: string) => {
        setSelectedTables(prev => 
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const selectAllTables = () => {
        if (selectedTables.length === LEAD_TABLES.length) {
            setSelectedTables([]);
        } else {
            setSelectedTables(LEAD_TABLES.map(t => t.id));
        }
    };

    const filteredLeads = leads.filter(l => 
        l.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.phone?.includes(searchQuery) ||
        l.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-10 pt-24 min-h-screen bg-slate-50/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-onyx mb-2 tracking-tight">Lead Management</h1>
                    <p className="text-onyx-light font-medium uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                        <TrendingUp size={14} className="text-burgundy" />
                        Intelligence & Conversion Dashboard
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={() => {
                            setSelectedTables([]);
                            setShowTemplateModal(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-border-subtle rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-burgundy/40 transition-all shadow-sm"
                    >
                        <Download size={14} className="text-muted" /> Get Templates
                    </button>
                    
                    <input 
                        type="file" 
                        id="csvImport" 
                        className="hidden" 
                        accept=".csv"
                        onChange={handleImport}
                    />
                    <label 
                        htmlFor="csvImport"
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-border-subtle rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-burgundy/40 transition-all cursor-pointer shadow-sm"
                    >
                        <Download size={14} className="rotate-180 text-muted" /> Import CSV
                    </label>

                    <button 
                        onClick={() => {
                            setSelectedTables([]);
                            setShowExportModal(true);
                        }}
                        className="flex items-center gap-2 px-8 py-3 bg-burgundy text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-burgundy/20"
                    >
                        <Download size={14} /> Bulk Export
                    </button>
                </div>
            </div>

            {/* Table Selector Strip */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 mb-10 pb-4">
                {LEAD_TABLES.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTable(t)}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeTable.id === t.id ? 'bg-onyx text-white shadow-lg' : 'bg-white border border-border-subtle text-muted hover:border-burgundy/40'}`}
                    >
                        {t.name}
                    </button>
                ))}
            </div>

            {/* Table Header */}
            <div className="bg-white rounded-[3rem] border border-border-subtle shadow-2xl shadow-black/[0.03] overflow-hidden">
                <div className="p-10 border-b border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-burgundy/10 rounded-2xl flex items-center justify-center">
                            <MessageCircle size={24} className="text-burgundy" />
                        </div>
                        <div>
                            <span className="text-lg font-black text-onyx uppercase tracking-widest">{activeTable.name}</span>
                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Showing {filteredLeads.length} active inquiries</p>
                        </div>
                    </div>
                    <div className="relative flex-1 max-w-md">
                        <input 
                            type="text" 
                            placeholder="Search by name, phone or email..."
                            className="w-full bg-white border border-border-subtle rounded-2xl px-12 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-burgundy/5 transition-all font-medium"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-border-subtle">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted/60">Lead Source</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted/60">Conversion Quality</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted/60">Context & History</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted/60">Pipeline Stage</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted/60">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-8 h-8 border-4 border-burgundy/20 border-t-burgundy rounded-full animate-spin" />
                                                <p className="text-xs font-bold uppercase tracking-widest text-muted">Retrieving Data...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredLeads.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-32 text-center italic text-muted text-sm font-medium">No records found in this category.</td>
                                    </tr>
                                ) : filteredLeads.map((lead) => (
                                    <motion.tr 
                                        key={lead.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-white border border-border-subtle rounded-2xl flex items-center justify-center shrink-0 group-hover:border-burgundy/20 transition-colors shadow-sm">
                                                    <User size={20} className="text-onyx" />
                                                </div>
                                                <div>
                                                    <p className="text-base font-black text-onyx">{lead.name}</p>
                                                    <p className="text-xs text-muted font-bold tracking-tight">{lead.phone || lead.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-onyx-light">Score</span>
                                                    <span className="text-[10px] font-black text-onyx">{lead.quality_score || 20}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${lead.quality_score || 20}%` }}
                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                        className={`h-full ${lead.quality_score >= 80 ? 'bg-emerald-500' : lead.quality_score >= 50 ? 'bg-amber-500' : 'bg-burgundy'}`}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="max-w-xs">
                                                {activeTable.id === 'valuation' ? (
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-bold text-onyx">{lead.year} {lead.make} {lead.model}</p>
                                                        <p className="text-[10px] text-muted font-medium uppercase tracking-widest">
                                                            {lead.trim} | {lead.transmission} | {lead.mileage_km?.toLocaleString()} KM
                                                        </p>
                                                        <p className="text-[9px] px-2 py-0.5 bg-slate-100 rounded inline-block font-black uppercase tracking-tighter text-onyx-light">
                                                            Condition: {lead.condition}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-onyx-light font-medium line-clamp-2 leading-relaxed italic">
                                                        "{lead.notes || lead.message || lead.service_interest || lead.document_type || 'No additional details provided.'}"
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 mt-3 text-[9px] font-black uppercase tracking-widest text-muted/60">
                                                    <Calendar size={12} className="text-burgundy" />
                                                    {new Date(lead.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                lead.status === 'new' ? 'bg-burgundy/10 text-burgundy' : 
                                                lead.status === 'contacted' ? 'bg-blue-500/10 text-blue-500' : 
                                                'bg-emerald-500/10 text-emerald-500'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    lead.status === 'new' ? 'bg-burgundy' : 
                                                    lead.status === 'contacted' ? 'bg-blue-500' : 
                                                    'bg-emerald-500'
                                                }`} />
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2">
                                                {lead.whatsapp && (
                                                    <a 
                                                        href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-10 h-10 flex items-center justify-center bg-emerald-500 text-white hover:bg-emerald-600 transition-all rounded-xl shadow-lg shadow-emerald-500/20"
                                                        title="WhatsApp User"
                                                    >
                                                        <MessageCircle size={16} />
                                                    </a>
                                                )}
                                                <button 
                                                    onClick={() => updateStatus(lead.id, 'contacted')}
                                                    className="w-10 h-10 flex items-center justify-center bg-white border border-border-subtle hover:border-blue-500/50 hover:text-blue-500 transition-all rounded-xl shadow-sm"
                                                    title="Mark as Contacted"
                                                >
                                                    <Phone size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => updateStatus(lead.id, 'closed')}
                                                    className="w-10 h-10 flex items-center justify-center bg-white border border-border-subtle hover:border-emerald-500/50 hover:text-emerald-500 transition-all rounded-xl shadow-sm"
                                                    title="Mark as Closed"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => deleteLead(lead.id)}
                                                    className="w-10 h-10 flex items-center justify-center bg-white border border-border-subtle hover:border-burgundy/50 hover:text-burgundy transition-all rounded-xl shadow-sm"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Export/Template Modal */}
            <AnimatePresence>
                {(showExportModal || showTemplateModal) && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-onyx/40 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-10 border-b border-border-subtle flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-black text-onyx uppercase tracking-widest">
                                        {showExportModal ? 'Select Tables to Export' : 'Select Templates to Download'}
                                    </h2>
                                    <p className="text-xs text-muted font-bold mt-1 uppercase tracking-widest">
                                        {showExportModal ? 'Export raw lead data in CSV format' : 'Download empty CSV layouts for manual population'}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setShowExportModal(false);
                                        setShowTemplateModal(false);
                                    }}
                                    className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-full hover:bg-slate-100 transition-colors"
                                >
                                    <ArrowRight className="rotate-180" size={24} />
                                </button>
                            </div>

                            <div className="p-10">
                                <div className="grid grid-cols-2 gap-4 mb-10">
                                    {LEAD_TABLES.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => toggleTableSelection(t.id)}
                                            className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                                                selectedTables.includes(t.id) 
                                                ? 'bg-burgundy/5 border-burgundy ring-1 ring-burgundy' 
                                                : 'bg-white border-border-subtle hover:border-burgundy/20'
                                            }`}
                                        >
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${selectedTables.includes(t.id) ? 'text-burgundy' : 'text-onyx'}`}>
                                                {t.name}
                                            </span>
                                            {selectedTables.includes(t.id) && <CheckCircle size={16} className="text-burgundy" />}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-border-subtle">
                                    <button 
                                        onClick={selectAllTables}
                                        className="text-[10px] font-black uppercase tracking-widest text-onyx hover:text-burgundy transition-colors"
                                    >
                                        {selectedTables.length === LEAD_TABLES.length ? 'Deselect All' : 'Select All Tables'}
                                    </button>
                                    <button 
                                        onClick={showExportModal ? handleBulkExport : handleBulkTemplate}
                                        disabled={selectedTables.length === 0}
                                        className="flex items-center gap-3 px-12 py-4 bg-onyx text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-burgundy disabled:opacity-20 disabled:pointer-events-none transition-all shadow-xl shadow-black/10"
                                    >
                                        <Download size={16} />
                                        {showExportModal ? `Export ${selectedTables.length} Tables` : `Download ${selectedTables.length} Templates`}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

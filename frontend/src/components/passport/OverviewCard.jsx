import React from 'react'
import { Card, CardContent } from '../ui/Card'
import { Activity, FileText, Pill, Syringe } from 'lucide-react'

export default function OverviewCard() {
  return (
    <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-sm flex items-center justify-center">
            {/* Avatar placeholder */}
            <span className="text-2xl font-bold text-gray-400">PS</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Priya Sharma</h2>
            <div className="flex gap-3 text-sm text-gray-600 mt-1">
              <span>34 yrs</span>
              <span>•</span>
              <span className="font-semibold text-danger">O+ Blood Group</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-subtle border border-gray-100 flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <FileText size={20} />
            </div>
            <div>
              <div className="text-xl font-bold">12</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Reports</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-subtle border border-gray-100 flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg text-green-600">
              <Pill size={20} />
            </div>
            <div>
              <div className="text-xl font-bold">5</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Prescriptions</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-subtle border border-gray-100 flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
              <Activity size={20} />
            </div>
            <div>
              <div className="text-xl font-bold">8</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Consultations</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-subtle border border-gray-100 flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
              <Syringe size={20} />
            </div>
            <div>
              <div className="text-xl font-bold">4</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Vaccinations</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

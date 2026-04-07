/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { VideoBackground } from './components/VideoBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen w-full font-sans selection:bg-[rgba(90,225,76,0.3)] selection:text-black">
        <VideoBackground />
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

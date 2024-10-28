'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { toast } from "./ui/use-toast"
import { X } from 'lucide-react'

// 飲み物のデータ
const drinks = [
  { name: 'バナナ豆乳', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/drink_banana_juice-jZPA2WOlJvaKpvzYqgtUFc4PAbLrU4.png' },
  { name: 'エナジードリンク', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/drink_energy_can-2ysrgxXEX0uO47JzWZfbQ1KMlbU1UQ.png' },
  { name: '水', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/petbottle_water_full-GyD4FUUn4W8nZp3aT99F372mBpVp6n.png' },
  { name: 'コーラ', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/drink_cola_petbottle-D7rGnVBBDlGw3dlV4F1Mesh8MS48j7.png' },
  { name: 'ふつうの豆乳', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/drink_tounyu2-svUmaugWmbrYAUWb3LyfEKTPoJKbNL.png' },
]

// 動画のデータ
const videos = [
  { id: 'Sduy4TCUqQ4', title: 'しかのこだと思った' },
  { id: 'WRBresZ1Lho', title: 'ファットある' },
  { id: 'dAftUqx9JBE', title: 'りんご買った' },
  { id: 'bKo1rUXE-lI', title: '投げ食い良くない' },
  { id: '2-OwBecW4QU', title: '海外ミームのやつ踊りたかった' },
  { id: 'jnyOEnp_2Y0', title: '最後まで頑張った' },
  { id: 'w3swmIyq3Ao', title: '空飛んだ' },
  { id: '3Ft0kYEymHc', title: 'しゅきっちゅーの' },
]

export default function VendingMachinePlayer() {
  const [selectedDrink, setSelectedDrink] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [stage, setStage] = useState('selection')

  // 飲み物選択時の処理
  const handleDrinkSelect = (drink) => {
    setSelectedDrink(drink)
    const randomVideo = videos[Math.floor(Math.random() * videos.length)]
    setSelectedVideo(randomVideo)
    toast({ 
      title: "おもしろい動画が見つかりました！", 
      description: "Xでみんなに教えよう！下の「Xで紹介」ボタンを押してね。" 
    })
    setStage('playing')
  }

  // クリップボードにコピーする関数
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "リンクをコピーしました", description: "SNSで共有できます" })
    })
  }

  // YouTube Shortsを開く関数
  const openYouTubeShort = (videoId) => {
    window.open(`https://www.youtube.com/shorts/${videoId}`, '_blank', 'noopener,noreferrer')
  }

  const shareToX = () => {
    const text = `${selectedDrink.name}を選んだら、「${selectedVideo.title}」という面白い動画が出てきた！みんなも試してみて！`
    const url = 'https://drinkable-vending-machine.vercel.app/' // アプリの実際のURLに更新してください
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-900 p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kusa-eCSdzqxAIkxv97MaxBBlq3NbSwEem5.png"
          width={50}
          height={50}
          alt="ドリンカブル自販機のロゴ"
          className="mb-2 sm:mb-0 sm:mr-4"
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-100">ドリンカブル自販機</h1>
      </div>
      <div className="max-w-4xl mx-auto bg-green-50 rounded-lg shadow-lg p-4 sm:p-6">
        {stage === 'selection' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {drinks.map((drink) => (
                <Button
                  key={drink.name}
                  onClick={() => handleDrinkSelect(drink)}
                  className="p-2 sm:p-4 bg-green-700 hover:bg-green-800 text-white transition-colors flex flex-col items-center h-40 sm:h-64 justify-between"
                >
                  <div className={`relative ${drink.name === '水' ? 'w-24 h-24 sm:w-36 sm:h-36' : 'w-28 h-28 sm:w-40 sm:h-40'} mb-2`}>
                    <Image
                      src={drink.image}
                      alt={drink.name}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-center">{drink.name}</p>
                </Button>
              ))}
            </div>
            <p className="text-center text-base sm:text-lg font-medium mt-4 mb-6 text-green-800">
              好きな飲み物選びなさい
            </p>
          </>
        )}

        {stage === 'playing' && selectedDrink && selectedVideo && (
          <Card className="bg-green-100">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-green-900">お楽しみください: {selectedDrink.name}</h2>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-green-900">そんなあなたにおすすめのドリンカブル動画はこちら:</h3>
              <div className="flex justify-center mb-4">
                <div className="w-[315px] h-[560px] bg-black relative">
                  <button
                    onClick={() => openYouTubeShort(selectedVideo.id)}
                    className="absolute inset-0 flex items-center justify-center text-white bg-opacity-50 bg-black hover:bg-opacity-75 transition-all"
                    aria-label="動画を再生"
                  >
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      動画を見る
                    </div>
                  </button>
                </div>
              </div>
              <p className="text-base sm:text-lg text-green-800 mb-2">{selectedVideo.title}</p>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Input 
                  value={`https://www.youtube.com/shorts/${selectedVideo.id}`}
                  readOnly
                  className="w-full sm:w-auto flex-grow"
                  aria-label="動画のURL"
                />
                <div className="flex space-x-2 w-full sm:w-auto">
                  <Button 
                    onClick={() => copyToClipboard(`https://www.youtube.com/shorts/${selectedVideo.id}`)}
                    className="flex-1 sm:flex-none bg-green-700 hover:bg-green-800 text-white"
                  >
                    コピー
                  </Button>
                  <Button onClick={shareToX} className="flex-1 sm:flex-none bg-black hover:bg-gray-800 text-white font-bold">
                    <X className="w-5 h-5 mr-2" />
                    Xで紹介
                  </Button>
                </div>
              </div>
              <p className="mt-4 text-xs sm:text-sm text-green-700">
                ※ この動画は「ドリンカブル」チャンネルからのおすすめです。
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
'use client'
import './globals.css';
import { useEffect, useState } from 'react'
import { WebApp } from '@twa-dev/types'
import Hamster from './icons/Hamster';
import Mine from './icons/Mine';
import Friends from './icons/Friends';
import Coins from './icons/Coins';
import Info from './icons/Info';
import Settings from './icons/Settings';


declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp
    }
  }
}

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()

      const initData = tg.initData || ''
      const initDataUnsafe = tg.initDataUnsafe || {}

      if (initDataUnsafe.user) {
        fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(initDataUnsafe.user),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              setError(data.error)
            } else {
              setUser(data)
            }
          })
          .catch((err) => {
            setError('Failed to fetch user data')
          })
      } else {
        setError('No user data available')
      }
    } else {
      setError('This app should be opened in Telegram')
    }
  }, [])

  const handleIncreasePoints = async () => {
    if (!user) return

    try {
      const res = await fetch('/api/increase-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegramId: user.telegramId }),
      })
      const data = await res.json()
      if (data.success) {
        setUser({ ...user, points: data.points })
        setNotification('Points increased successfully!')
        setTimeout(() => setNotification(''), 3000)
      } else {
        setError('Failed to increase points')
      }
    } catch (err) {
      setError('An error occurred while increasing points')
    }
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  if (!user) return <div className="container mx-auto p-4">Loading...</div>



 

  return (

    
    <div className="bg-black flex justify-center">
    <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
      <div className="px-4 z-10">
        <div className="flex items-center space-x-2 pt-4">
          <div className="p-1 rounded-lg bg-[#1d2025]">
            <Hamster size={24} className="text-[#d4d4d4]" />
          </div>
          <div>
            <p className="text-sm">{user.firstName} (CEO)</p>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-4 mt-1">
          <div className="flex items-center w-1/3">
            <div className="w-full">
              <div className="flex justify-between">
                
              </div>
          

            </div>
          </div>
          <div className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64">
           
            <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
            <div className="flex-1 text-center">
              <p className="text-xs text-[#85827d] font-medium">Profit per hour</p>
              <div className="flex items-center justify-center space-x-1">
                
                <p className="text-sm"></p>
                <Info size={20} className="text-[#43433b]" />
              </div>
            </div>
            <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
            <Settings className="text-white" />
          </div>
        </div>
      </div>

      <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
        <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
          <div className="px-4 mt-6 flex justify-between gap-2">
            <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
              <div className="dot"></div>
            
              <p className="text-[10px] text-center text-white mt-1">Daily reward</p>
              <p className="text-[10px] font-medium text-center text-gray-400 mt-2"></p>
            </div>
            <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
              <div className="dot"></div>
             
              <p className="text-[10px] text-center text-white mt-1">Daily cipher</p>
              <p className="text-[10px] font-medium text-center text-gray-400 mt-2"></p>
            </div>
            <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
              <div className="dot"></div>
              
              <p className="text-[10px] text-center text-white mt-1">Daily combo</p>
              <p className="text-[10px] font-medium text-center text-gray-400 mt-2"></p>
            </div>
          </div>

      
        </div>
      </div>
    </div>

    <div className="px-4 mt-4 flex justify-center">
             <div className="px-4 py-2 flex items-center space-x-2">
               
               <p className="text-4xl text-white">{user.points}</p>
             </div>
          
          </div>

          <div className="px-4 mt-4 flex justify-center">
              <div className="w-80 h-80 p-4 rounded-full circle-outer">
                <div className="w-full h-full rounded-full circle-inner">
                <button
            onClick={handleIncreasePoints}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
             Increase Points
             </button>

             {notification && (
             <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
             {notification}
             </div>
            )}
                 
                </div>
              </div>
            </div>

    {/* Bottom fixed div */}
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
      <div className="text-center text-[#85827d] w-1/5 bg-[#1c1f24] m-1 p-2 rounded-2xl">
       
        <p className="mt-1">Exchange</p>
      </div>
      <div className="text-center text-[#85827d] w-1/5">
        <Mine className="w-8 h-8 mx-auto" />
        <p className="mt-1">Mine</p>
      </div>
      <div className="text-center text-[#85827d] w-1/5">
        <Friends className="w-8 h-8 mx-auto" />
        <p className="mt-1">Friends</p>
      </div>
      <div className="text-center text-[#85827d] w-1/5">
        <Coins className="w-8 h-8 mx-auto" />
        <p className="mt-1">Earn</p>
      </div>
      <div className="text-center text-[#85827d] w-1/5">
        
        <p className="mt-1">Airdrop</p>
      </div>
    </div>

 
  </div>
  )
}
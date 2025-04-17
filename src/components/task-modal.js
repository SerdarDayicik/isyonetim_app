"use client"

import { Fragment, useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { CheckCircle, Clock, X, Calendar, User, AlertCircle } from "lucide-react"

export function TasksModal({ isOpen, onClose, project }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedTasks, setExpandedTasks] = useState({})

  // State columns için
  const [columns, setColumns] = useState({
    todo: {
      id: "todo",
      title: "Yapılmadı",
      items: []
    },
    inProgress: {
      id: "inProgress",
      title: "Yapılıyor",
      items: []
    },
    done: {
      id: "done",
      title: "Tamamlandı",
      items: []
    }
  })

  useEffect(() => {
    if (isOpen && project) {
      setLoading(true)
      setTasks([])
      setExpandedTasks({})
      setColumns({
        todo: { id: "todo", title: "Yapılmadı", items: [] },
        inProgress: { id: "inProgress", title: "Yapılıyor", items: [] },
        done: { id: "done", title: "Tamamlandı", items: [] }
      })
      
      // Yeni API ile verileri yükle
      loadTasksData()
    }
  }, [isOpen, project?.id])

  // Yeni API ile tek bir istekte tüm verileri al
  const loadTasksData = async () => {
    if (!project) return
    
    setLoading(true)
    setError(null)
    
    try {
      console.log(`${project?.name} (ID: ${project?.id}) için görev verileri yükleniyor...`)
      const token = localStorage.getItem("token")
      
      if (!token) {
        setError("Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.")
        setLoading(false)
        return
      }
      
      // Yeni API ile tüm verileri tek seferde al
      console.log(`Proje ID ${project.id} için tüm görev detayları isteniyor...`)
      const response = await fetch("http://10.33.41.153:8000/Admin/project_tasks_details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          project_id: project.id
        }),
      })
      
      if (!response.ok) {
        console.error("Görev detayları yüklenirken API hatası:", await response.text())
        throw new Error("Görev detayları yüklenirken bir hata oluştu")
      }
      
      const tasksData = await response.json()
      console.log("API yanıtı:", tasksData)
      
      if (!tasksData || tasksData.length === 0) {
        console.log("Bu proje için görev bulunamadı.")
        setTasks([])
        setLoading(false)
        return
      }
      
      // Görevleri ayarla ve tüm task_id'ler için expanded durumunu true olarak belirle
      const expandedMap = {}
      tasksData.forEach(task => {
        expandedMap[task.task_id] = true
      })
      
      setTasks(tasksData)
      setExpandedTasks(expandedMap)
      
      // Görevleri ve alt görevleri kolonlara ayır
      organizeItems(tasksData)
      
      setLoading(false)
    } catch (error) {
      console.error("Veri yüklenirken hata:", error)
      setError(`Görev bilgileri yüklenirken bir hata oluştu: ${error.message}`)
      setTasks([])
      setLoading(false)
    }
  }
  
  // Öğeleri durumlarına göre sınıflandır
  const organizeItems = (tasksData) => {
    const todoItems = []
    const inProgressItems = []
    const doneItems = []
    
    tasksData.forEach(task => {
      // Görev nesnesini hazırla
      const taskItem = {
        ...task,
        type: 'task',
        id: `task-${task.task_id}`,
        state_id: task.state_id || 1 // Varsayılan olarak 1 (Yapılmadı)
      }
      
      // API'de state_id bilgisi yoksa burada mantıksal olarak belirle
      // Eğer task içinde state_id gelmiyorsa alt görevlere bakarak belirle
      if (!task.state_id) {
        const completedSubtasks = (task.subtasks || []).filter(st => st.state_id === 3).length
        const totalSubtasks = (task.subtasks || []).length
        
        if (totalSubtasks > 0 && completedSubtasks === totalSubtasks) {
          taskItem.state_id = 3 // Tamamlandı
        } else if (completedSubtasks > 0) {
          taskItem.state_id = 2 // Yapılıyor
        } else {
          taskItem.state_id = 1 // Yapılmadı
        }
      }
      
      // Görevin durumuna göre sütunlara ekle
      if (taskItem.state_id === 3) {
        doneItems.push(taskItem)
      } else if (taskItem.state_id === 2) {
        inProgressItems.push(taskItem)
      } else {
        todoItems.push(taskItem)
      }
      
      // Alt görevleri ekle
      (task.subtasks || []).forEach(subtask => {
        const subtaskItem = {
          ...subtask,
          type: 'subtask',
          id: `subtask-${subtask.subtask_id}`,
          parentTaskId: task.task_id,
          parentTask: task.title,
          state_id: subtask.state_id || 1 // Varsayılan olarak 1 (Yapılmadı)
        }
        
        // Alt görevin durumuna göre sütunlara ekle
        if (subtaskItem.state_id === 3) {
          doneItems.push(subtaskItem)
        } else if (subtaskItem.state_id === 2) {
          inProgressItems.push(subtaskItem)
        } else {
          todoItems.push(subtaskItem)
        }
      })
    })
    
    // Kolonları güncelle
    setColumns({
      todo: {
        id: "todo",
        title: "Yapılmadı",
        items: todoItems
      },
      inProgress: {
        id: "inProgress",
        title: "Yapılıyor",
        items: inProgressItems
      },
      done: {
        id: "done",
        title: "Tamamlandı",
        items: doneItems
      }
    })
  }
  
  // Görev açıp-kapama fonksiyonu
  const toggleTask = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }))
  }
  
  // Görev durumu güncelleme fonksiyonu
  const updateTaskState = async (taskId, newStateId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Oturum bilgisi bulunamadı.")
        return
      }
      
      console.log(`Görev ID ${taskId} durumu ${newStateId} olarak güncelleniyor...`)
      
      // Güncellenecek görevi bulalım
      const taskToUpdate = tasks.find(t => t.task_id === taskId)
      
      if (!taskToUpdate) {
        throw new Error(`Görev ID ${taskId} bulunamadı`)
      }
      
      // Tüm task verilerini hazırlayalım
      const taskData = {
        token,
        task_id: taskId,
        state_id: newStateId,
        title: taskToUpdate.title,
        description: taskToUpdate.description,
        end_time: taskToUpdate.end_time || null,
        level_id: taskToUpdate.level_id || 1 // level_id'yi ekledik, yoksa varsayılan 1 verdik
      }
      
      console.log("Görev güncelleme verileri:", taskData)
      
      // API'ye PUT isteği gönder
      const response = await fetch("http://10.33.41.153:8000/Task/update_task", {
        method: "PUT", // PUT metodunu kullan
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData)
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("API cevabı:", errorText)
        throw new Error(`Görev durumu güncellenirken hata: ${errorText}`)
      }
      
      console.log("Görev durumu başarıyla güncellendi")
      
      // Görev tamamlandı olarak işaretlendiyse, tüm alt görevleri de tamamlandı olarak işaretle
      if (newStateId === 3) {
        const task = tasks.find(t => t.task_id === taskId)
        if (task && task.subtasks && task.subtasks.length > 0) {
          console.log(`Görevin ${task.subtasks.length} alt görevi de tamamlandı olarak işaretleniyor...`)
          
          // Her alt görevi tek tek güncelle
          for (const subtask of task.subtasks) {
            if (subtask.state_id !== 3) { // Sadece tamamlanmamış olanları güncelle
              await updateSubtaskState(subtask.subtask_id, 3, false) // Yenileme yapmadan güncelle
            }
          }
        }
      }
      
      // Verileri yeniden yükle
      await loadTasksData()
      
    } catch (error) {
      console.error("Görev durumu güncellenirken hata:", error)
      setError(`Görev durumu güncellenirken bir hata oluştu: ${error.message}`)
    }
  }
  
  // Alt görev durumu güncelleme fonksiyonu
  const updateSubtaskState = async (subtaskId, newStateId, shouldReload = true) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Oturum bilgisi bulunamadı.")
        return
      }
      
      console.log(`Alt görev ID ${subtaskId} durumu ${newStateId} olarak güncelleniyor...`)
      
      // Önce güncellenecek alt görevi bulalım
      let subtaskToUpdate = null;
      let parentTaskId = null;
      let parentTask = null;
      
      // tasks içinde dön ve alt görevi bul
      for (const task of tasks) {
        const foundSubtask = task.subtasks.find(s => s.subtask_id === subtaskId);
        if (foundSubtask) {
          subtaskToUpdate = foundSubtask;
          parentTaskId = task.task_id;
          parentTask = task;
          break;
        }
      }
      
      if (!subtaskToUpdate) {
        throw new Error(`Alt görev ID ${subtaskId} bulunamadı`);
      }
      
      // Ana görevin durumunu kontrol et - ana görev başlatılmadan alt görev başlatılamaz
      if (parentTask.state_id === 1) {
        setError("Ana görev başlatılmadan alt görevler başlatılamaz!");
        return;
      }
      
      // Tüm subtask verilerini hazırlayalım
      const subtaskData = {
        token,
        subtask_id: subtaskId,
        state_id: newStateId,
        title: subtaskToUpdate.title,
        description: subtaskToUpdate.description,
        end_time: subtaskToUpdate.end_time || null,
        level_id: subtaskToUpdate.level_id || 1 // level_id'i ekledik, yoksa varsayılan 1 verdik
      };
      
      console.log("Alt görev güncelleme verileri:", subtaskData);
      
      // API'ye PUT isteği gönder
      const response = await fetch("http://10.33.41.153:8000/Subtask/update_subtask", {
        method: "PUT", // PUT metodunu kullan
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subtaskData)
      });
      
      if (!response.ok) {
        throw new Error(`Alt görev durumu güncellenirken hata: ${await response.text()}`);
      }
      
      console.log("Alt görev durumu başarıyla güncellendi");
      
      // Ana görevi kontrol et - tüm alt görevler tamamlandıysa ana görevi de tamamla
      if (newStateId === 3 && parentTaskId) {
        let allCompleted = true;
        
        // Bu alt görevin ana görevinin diğer alt görevlerini kontrol et
        for (const task of tasks) {
          if (task.task_id === parentTaskId) {
            for (const st of task.subtasks) {
              // Eğer bu güncellenecek görev dışında tamamlanmamış alt görev varsa
              if (st.subtask_id !== subtaskId && st.state_id !== 3) {
                allCompleted = false;
                break;
              }
            }
            break;
          }
        }
        
        // Tüm alt görevler tamamlandıysa ana görevi de tamamla
        if (allCompleted) {
          console.log(`Tüm alt görevler tamamlandı. Ana görev ID ${parentTaskId} tamamlandı olarak işaretleniyor...`);
          await updateTaskState(parentTaskId, 3);
          shouldReload = false; // Ana görev güncellemesi zaten verileri yenileyecek
        }
      }
      
      // Verileri yeniden yükle (eğer ana görev güncellenmiyorsa)
      if (shouldReload) {
        await loadTasksData();
      }
      
    } catch (error) {
      console.error("Alt görev durumu güncellenirken hata:", error);
      setError(`Alt görev durumu güncellenirken bir hata oluştu: ${error.message}`);
    }
  };
  
  // TaskCard bileşeni - daha modern tasarım
  const TaskCard = ({ task }) => {
    const isExpanded = expandedTasks[task.task_id] || false
    const hasSubtasks = task.subtasks && task.subtasks.length > 0
    
    // Alt görevlerin tamamlanma durumunu hesapla
    const completedSubtasks = hasSubtasks 
      ? task.subtasks.filter(st => st.state_id === 3).length 
      : 0
    const totalSubtasks = hasSubtasks ? task.subtasks.length : 0
    const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0
    
    // Durum renklerini belirle
    const statusColors = {
      1: "border-l-4 border-gray-300",  // Yapılmadı
      2: "border-l-4 border-blue-300",  // Yapılıyor
      3: "border-l-4 border-green-300"  // Tamamlandı
    }
    
    return (
      <div className={`mb-4 bg-white rounded-lg shadow-sm hover:shadow transition-shadow ${statusColors[task.state_id]}`}>
        <div 
          className="p-4 flex justify-between items-center cursor-pointer"
          onClick={() => hasSubtasks && toggleTask(task.task_id)}
        >
          <div className="flex-grow">
            <div className="flex items-center">
              <h4 className="font-medium text-gray-900 text-md">{task.title}</h4>
              {hasSubtasks && (
                <div className="ml-3 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-500">
                  {task.subtasks.length} alt görev ({completedSubtasks}/{totalSubtasks})
                </div>
              )}
            </div>
            
            {task.description && (
              <p className="mt-1 text-sm text-gray-600">{task.description}</p>
            )}
            
            {/* İlerleme çubuğu */}
            {hasSubtasks && (
              <div className="mt-2 flex items-center">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-2 ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Tarih bilgileri */}
            <div className="mt-2 flex text-xs text-gray-500">
              {task.start_time && (
                <div className="flex items-center mr-3">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  <span>{new Date(task.start_time).toLocaleDateString('tr-TR')}</span>
                </div>
              )}
              {task.end_time && (
                <div className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  <span>{new Date(task.end_time).toLocaleDateString('tr-TR')}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Sağ taraf - butonlar ve durum */}
          <div className="flex items-center ml-3">
            <div className="flex">
              {task.state_id !== 2 && task.state_id !== 3 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    updateTaskState(task.task_id, 2)
                  }}
                  className="mr-2 px-3 py-1.5 bg-white border border-blue-300 text-blue-600 rounded-md text-xs hover:bg-blue-50 transition-colors"
                >
                  Başlat
                </button>
              )}
              
              {task.state_id !== 3 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    updateTaskState(task.task_id, 3)
                  }}
                  className="mr-2 px-3 py-1.5 bg-white border border-green-300 text-green-600 rounded-md text-xs hover:bg-green-50 transition-colors"
                >
                  Tamamla
                </button>
              )}
              
              {hasSubtasks && (
                <button 
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleTask(task.task_id)
                  }}
                >
                  {isExpanded ? 
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 15l7-7 7 7"></path>
                    </svg> : 
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  }
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Alt görevler bölümü */}
        {isExpanded && hasSubtasks && (
          <div className="px-4 pb-3">
            <div className="border-t border-gray-100 pt-3 mt-2">
              <div className="pl-2 pr-2 pb-2 mb-2 text-xs font-medium text-gray-500 flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1.5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 5H20V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 19H4V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 5L13 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 19L11 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Alt Görevler
                </div>
                {task.state_id === 1 && (
                  <div className="text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">
                    Ana görev başlatılmadan alt görevler başlatılamaz
                  </div>
                )}
              </div>
              
              {task.subtasks.map(subtask => (
                <SubtaskCard 
                  key={`subtask-${subtask.subtask_id}`} 
                  subtask={subtask} 
                  updateSubtaskState={updateSubtaskState}
                  parentTask={task}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
  
  // Alt görev kartı bileşeni - daha modern tasarım
  const SubtaskCard = ({ subtask, updateSubtaskState, parentTask }) => {
    // Durum renklerini belirle
    const statusColors = {
      1: "bg-gray-50 text-gray-500",  // Yapılmadı
      2: "bg-blue-50 text-blue-500",  // Yapılıyor
      3: "bg-green-50 text-green-500" // Tamamlandı
    }
    
    const statusText = {
      1: "Yapılmadı",
      2: "Yapılıyor",
      3: "Tamamlandı"
    }
    
    // Ana görevin durumunu kontrol et
    const parentTaskState = parentTask ? parentTask.state_id : 1;
    const canStartSubtask = parentTaskState >= 2; // Ana görev Yapılıyor veya Tamamlandı ise
    
    return (
      <div className="mb-2 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
        <div className="p-3 flex justify-between items-center">
          {/* Sol taraf - alt görev bilgileri */}
          <div className="flex items-center">
            <div 
              className={`w-5 h-5 flex items-center justify-center rounded-full mr-2 ${statusColors[subtask.state_id]}`}
              onClick={() => canStartSubtask && updateSubtaskState(subtask.subtask_id, subtask.state_id === 3 ? 1 : 3)}
            >
              {subtask.state_id === 3 ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <span className="w-3 h-3 rounded-full border-2 border-current"></span>
              )}
            </div>
            
            <div>
              <div className="font-medium text-sm text-gray-800">{subtask.title}</div>
              
              {subtask.description && (
                <p className="text-xs text-gray-500 mt-0.5">{subtask.description}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mt-1">
                {subtask.assignments && subtask.assignments.length > 0 && (
                  <div className="inline-flex items-center text-xs text-gray-500">
                    <User className="w-3 h-3 text-gray-400 mr-1" />
                    {subtask.assignments.map(a => a.user_name).join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sağ taraf - butonlar */}
          <div className="flex items-center">
            {!canStartSubtask ? (
              <div className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-500">
                Ana görev başlatılmalı
              </div>
            ) : (
              <>
                {subtask.state_id !== 2 && subtask.state_id !== 3 && (
                  <button 
                    onClick={() => updateSubtaskState(subtask.subtask_id, 2)}
                    className="px-2 py-1 rounded text-xs bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors mr-1"
                  >
                    Başlat
                  </button>
                )}
                
                {subtask.state_id !== 3 && (
                  <button 
                    onClick={() => updateSubtaskState(subtask.subtask_id, 3)}
                    className="px-2 py-1 rounded text-xs bg-white border border-green-300 text-green-600 hover:bg-green-50 transition-colors"
                  >
                    Tamamla
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  // Kategori başlığı - daha modern tasarım
  const CategoryHeader = ({ title, count, icon }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="p-1.5 rounded-lg bg-white shadow-sm mr-2">
            {icon}
          </span>
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        <span className="px-2.5 py-1 bg-white shadow-sm rounded-full text-xs font-medium text-gray-700">
          {count}
        </span>
      </div>
    </div>
  )
  
  // Ana görevler ve alt görevleri listeleme bileşeni - daha modern tasarım
  const TaskList = ({ items, title, icon, color = "bg-gray-50" }) => {
    // Sadece ana görevleri filtrele
    const taskItems = items.filter(item => item.type === 'task');
    
    return (
      <div className={`${color} p-5 rounded-xl shadow-sm h-full overflow-auto`} style={{ minHeight: "450px", maxHeight: "600px" }}>
        <CategoryHeader 
          title={title} 
          count={taskItems.length} 
          icon={icon} 
        />
        
        <div className="space-y-3">
          {taskItems.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
          
          {taskItems.length === 0 && (
            <div className="flex items-center justify-center py-8 px-4 rounded-lg bg-white border border-dashed border-gray-200 text-sm text-gray-400">
              <svg className="w-5 h-5 mr-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Bu durumda görev bulunmuyor
            </div>
          )}
        </div>
      </div>
    )
  }
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-gray-50 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    {project?.name} - Görevler
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                  </div>
                ) : error ? (
                  <div className="flex justify-center items-center h-96 text-red-500 bg-red-50 rounded-xl p-4">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="flex flex-col justify-center items-center h-96 bg-white rounded-xl shadow-sm p-8">
                    <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p className="text-xl font-medium text-gray-700">Bu proje için henüz görev bulunmuyor</p>
                    <p className="mt-2 text-gray-400">Proje yöneticisi görev ekleyince burada görüntülenecek</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TaskList 
                      items={columns.todo.items} 
                      title="Yapılmadı" 
                      icon={<Clock className="w-5 h-5 text-gray-500" />}
                      color="bg-gray-50" 
                    />
                    <TaskList 
                      items={columns.inProgress.items} 
                      title="Yapılıyor" 
                      icon={<svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 8l-8 8m0-8l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>}
                      color="bg-blue-50"
                    />
                    <TaskList 
                      items={columns.done.items} 
                      title="Tamamlandı" 
                      icon={<CheckCircle className="w-5 h-5 text-green-500" />}
                      color="bg-green-50"
                    />
                  </div>
                )}
                
                {/* Yeniden yükleme butonu */}
                {!loading && tasks.length > 0 && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={loadTasksData}
                      className="px-5 py-2.5 bg-white text-blue-600 rounded-lg shadow-sm border border-blue-200 hover:bg-blue-50 transition-colors flex items-center font-medium"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      Görevleri Yenile
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
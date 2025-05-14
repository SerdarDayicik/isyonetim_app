"use client"

import { Fragment, useState, useEffect, useRef } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { CheckCircle, Clock, X, Calendar, User, AlertCircle } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"

// API URL'sini en üstte tanımla
const API_KEY = process.env.REACT_APP_API_URL;

export function TasksModal({ isOpen, onClose, project, role }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedTasks, setExpandedTasks] = useState({})
  const [loadingItems, setLoadingItems] = useState({})
  const [showAddTaskForm, setShowAddTaskForm] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    difficulty: "orta", // kolay, orta, zor
    startDate: "",
    endDate: ""
  })
  const [newSubtasks, setNewSubtasks] = useState([{ 
    title: "", 
    description: "",
    assignee: null,
    startDate: "",
    endDate: "",
    difficulty: "orta"
  }])
  const [allUsers, setAllUsers] = useState([])

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

  // Alt görev ekleme formunu göstermek için yeni state ekleyelim
  const [showAddSubtaskForm, setShowAddSubtaskForm] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [newSubtaskForExistingTask, setNewSubtaskForExistingTask] = useState({
    title: "",
    description: "",
    assignee: null,
    startDate: "",
    endDate: "",
    difficulty: "orta"
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

  useEffect(() => {
    if (isOpen && role === "admin") {
      fetchAllUsers()
    }
  }, [isOpen, role])

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return
      
      const response = await fetch(`${API_KEY}/User/get_users`)
      if (response.ok) {
        const data = await response.json()
        const usersWithId = data.map((user) => ({
          ...user,
          id: user.id,
          name: String(user.name || ""),
          surname: String(user.surname || ""),
          fullName: `${user.name || ""} ${user.surname || ""}`.trim(),
          email: String(user.email || ""),
          phone: String(user.phone || ""),
          role: String(user.role || "Kullanıcı"),
          avatar: user.profile_photo_url || 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(`${user.name || ""} ${user.surname || ""}`)}&background=random`,
        }))
        setAllUsers(usersWithId)
      }
    } catch (error) {
      console.error("Kullanıcıları getirirken hata:", error)
    }
  }

  const handleTaskChange = (e) => {
    const { name, value } = e.target
    // Tarih alanları için özel işlem
    if (name === 'startDate' || name === 'endDate') {
      setNewTask(prev => ({
        ...prev,
        [name]: value || '' // Eğer değer boşsa, boş string ata
      }))
    } else {
      setNewTask(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleAddSubtask = () => {
    setNewSubtasks([...newSubtasks, { 
      title: "", 
      description: "",
      assignee: null,
      startDate: "",
      endDate: "",
      difficulty: "orta"
    }])
  }

  const handleSubtaskChange = (index, field, value) => {
    const updatedSubtasks = [...newSubtasks]
    // Tarih alanları için özel işlem
    if (field === 'startDate' || field === 'endDate') {
      updatedSubtasks[index][field] = value || '' // Eğer değer boşsa, boş string ata
    } else {
      updatedSubtasks[index][field] = value
    }
    setNewSubtasks(updatedSubtasks)
  }

  const handleRemoveSubtask = (index) => {
    if (newSubtasks.length > 1) {
      const updatedSubtasks = [...newSubtasks]
      updatedSubtasks.splice(index, 1)
      setNewSubtasks(updatedSubtasks)
    }
  }

  const validateTaskForm = () => {
    if (!newTask.title.trim()) return "Görev adı gereklidir"
    if (!newTask.description.trim()) return "Görev açıklaması gereklidir"
    if (!newTask.startDate) return "Görev başlangıç tarihi gereklidir"
    if (!newTask.endDate) return "Görev bitiş tarihi gereklidir"
    
    // Tarih doğrulaması
    const startDate = new Date(newTask.startDate)
    const endDate = new Date(newTask.endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (startDate < today) return "Başlangıç tarihi bugünden önce olamaz"
    if (endDate < startDate) return "Bitiş tarihi başlangıç tarihinden önce olamaz"
    
    // Alt görevleri doğrulama
    for (let i = 0; i < newSubtasks.length; i++) {
      const subtask = newSubtasks[i]
      if (!subtask.title.trim()) return `Alt görev #${i+1}: Ad gereklidir`
      if (!subtask.description.trim()) return `Alt görev #${i+1}: Açıklama gereklidir`
      if (!subtask.assignee) return `Alt görev #${i+1}: Görevli seçilmelidir`
      if (!subtask.startDate) return `Alt görev #${i+1}: Başlangıç tarihi gereklidir`
      if (!subtask.endDate) return `Alt görev #${i+1}: Bitiş tarihi gereklidir`
      
      const subtaskStart = new Date(subtask.startDate)
      const subtaskEnd = new Date(subtask.endDate)
      
      if (subtaskStart < startDate) return `Alt görev #${i+1}: Başlangıç tarihi görev başlangıcından önce olamaz`
      if (subtaskEnd > endDate) return `Alt görev #${i+1}: Bitiş tarihi görev bitişinden sonra olamaz`
      if (subtaskEnd < subtaskStart) return `Alt görev #${i+1}: Bitiş tarihi başlangıç tarihinden önce olamaz`
    }
    
    return null // Hata yok
  }

  const handleSaveTask = async () => {
    const error = validateTaskForm()
    if (error) {
      toast.error(error)
      return
    }
    
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      if (!token) {
        toast.error("Oturum bilgisi bulunamadı")
        setLoading(false)
        return
      }
      
      // Zorluk seviyesi (level_id) değerini belirle
      let levelId = 2 // Varsayılan orta
      if (newTask.difficulty === "kolay") levelId = 1
      else if (newTask.difficulty === "zor") levelId = 3
      
      // Task için API verisi hazırla
      const taskData = {
        token: token,
        project_id: project.id,
        state_id: 1, // Her zaman 1 (Yapılmadı)
        level_id: levelId,
        title: newTask.title,
        description: newTask.description
      }
      
      // Görev oluşturma API isteği
      const taskResponse = await fetch(`${API_KEY}/Task/create_task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })
      
      if (!taskResponse.ok) {
        throw new Error("Görev oluşturulurken bir hata oluştu")
      }
      
      // Başarılı yanıtı al ve task_id değerini çıkart
      const taskResult = await taskResponse.json()
      const taskId = taskResult.task_id
      
      console.log(`Görev başarıyla oluşturuldu. Görev ID: ${taskId}`)
      
      // Alt görevleri ekleyelim
      if (newSubtasks.length > 0) {
        const subtasksToAdd = newSubtasks.map(subtask => {
          // Zorluk seviyesi (level_id) değerini belirle
          let subtaskLevelId = 2 // Varsayılan orta
          if (subtask.difficulty === "kolay") subtaskLevelId = 1
          else if (subtask.difficulty === "zor") subtaskLevelId = 3
          
          return {
            task_id: taskId,
            state_id: 1, // Her zaman 1 (Yapılmadı)
            level_id: subtaskLevelId,
            title: subtask.title,
            description: subtask.description
          }
        })
        
        // Alt görevleri ekle
        const subtaskResponse = await fetch(`${API_KEY}/Subtask/create_subtask`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            subtasks: subtasksToAdd
          }),
        })
        
        if (!subtaskResponse.ok) {
          throw new Error("Alt görevler eklenirken bir hata oluştu")
        }
        
        const subtaskResult = await subtaskResponse.json()
        
        // Alt görev ID'leri ve atanacak kullanıcıları eşleştir
        if (subtaskResult.created_subtask_ids && Array.isArray(subtaskResult.created_subtask_ids)) {
          const assignmentPromises = subtaskResult.created_subtask_ids.map((subtaskId, index) => {
            const subtask = newSubtasks[index]
            if (subtask.assignee && subtask.assignee.id) {
              return fetch(`${API_KEY}/SubtaskAssignment/create_subtask_assignment`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  subtask_id: subtaskId,
                  user_id: Number(subtask.assignee.id)
                }),
              })
            }
            return Promise.resolve()
          })
          
          await Promise.all(assignmentPromises)
        }
      }
      
      toast.success("Görev başarıyla oluşturuldu!")
      
      // Formu temizle ve kapat
      setNewTask({
        title: "",
        description: "",
        difficulty: "orta",
        startDate: "",
        endDate: ""
      })
      setNewSubtasks([{ 
        title: "", 
        description: "",
        assignee: null,
        startDate: "",
        endDate: "",
        difficulty: "orta"
      }])
      setShowAddTaskForm(false)
      
      // Verileri yeniden yükle
      await loadTasksData()
      
    } catch (error) {
      console.error("Görev oluşturulurken hata:", error)
      toast.error(error.message || "Görev oluşturulurken bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const getFormattedDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = getFormattedDate(new Date());
  const maxDate = getFormattedDate(new Date(new Date().setFullYear(new Date().getFullYear() + 10)));

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
      const response = await fetch(`${API_KEY}/Admin/project_tasks_details`, {
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
      // Eğer bu görev için zaten bir yükleme işlemi varsa, işlemi durdur
      if (loadingItems[`task-${taskId}`]) {
        return
      }
      
      // Bu görev için yükleme durumunu başlat
      setLoadingItems(prev => ({ ...prev, [`task-${taskId}`]: true }))
      
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Oturum bilgisi bulunamadı.")
        setLoadingItems(prev => ({ ...prev, [`task-${taskId}`]: false }))
        return
      }
      
      console.log(`Görev ID ${taskId} durumu ${newStateId} olarak güncelleniyor...`)
      
      // Güncellenecek görevi bulalım
      const taskToUpdate = tasks.find(t => t.task_id === taskId)
      
      if (!taskToUpdate) {
        throw new Error(`Görev ID ${taskId} bulunamadı`)
      }
      
      // Eğer görev tamamlanıyor ve alt görevleri varsa, tüm alt görevlerin tamamlandığını veya başlatıldığını kontrol et
      if (newStateId === 3 && taskToUpdate.subtasks && taskToUpdate.subtasks.length > 0) {
        const hasUncompletedSubtasks = taskToUpdate.subtasks.some(subtask => subtask.state_id !== 3);
        
        if (hasUncompletedSubtasks) {
          setError("Tüm alt görevler tamamlanmadan ana görev tamamlanamaz!");
          setLoadingItems(prev => ({ ...prev, [`task-${taskId}`]: false }))
          return;
        }
      }
      
      // Eğer görev başlatılıyor ve alt görevleri varsa, alt görevleri başlatılmamış olarak bırak
      
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
      const response = await fetch(`${API_KEY}/Task/update_task`, {
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
          
          // Alt görevleri toplu güncellemek için veri hazırla
          const subtasksToUpdate = task.subtasks
            .filter(subtask => subtask.state_id !== 3) // Sadece tamamlanmamış olanları filtrele
            .map(subtask => ({
              token,
              subtask_id: subtask.subtask_id,
              state_id: 3,
              title: subtask.title,
              description: subtask.description,
              end_time: subtask.end_time || null,
              level_id: subtask.level_id || 1
            }));
          
          if (subtasksToUpdate.length > 0) {
            try {
              // Tüm alt görevleri tek bir istekle güncelleme
              const updatePromises = subtasksToUpdate.map(subtaskData => 
                fetch(`${API_KEY}/Subtask/update_subtask`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(subtaskData)
                })
              );
              
              // Tüm istekleri aynı anda yap ama sonuçları beklemeden devam et
              Promise.all(updatePromises).catch(error => {
                console.error("Alt görevleri güncellerken hata:", error);
              });
            } catch (error) {
              console.error("Alt görevleri güncellerken hata:", error);
            }
          }
        }
      }
      
      // Verileri yeniden yükle
      await loadTasksData()
      
    } catch (error) {
      console.error("Görev durumu güncellenirken hata:", error)
      setError(`Görev durumu güncellenirken bir hata oluştu: ${error.message}`)
    } finally {
      // Yükleme durumunu kaldır
      setLoadingItems(prev => ({ ...prev, [`task-${taskId}`]: false }))
    }
  }
  
  // Alt görev durumu güncelleme fonksiyonu
  const updateSubtaskState = async (subtaskId, newStateId, shouldReload = true) => {
    try {
      // Eğer bu alt görev için zaten bir yükleme işlemi varsa, işlemi durdur
      if (loadingItems[`subtask-${subtaskId}`]) {
        return
      }
      
      // Bu alt görev için yükleme durumunu başlat
      setLoadingItems(prev => ({ ...prev, [`subtask-${subtaskId}`]: true }))
      
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Oturum bilgisi bulunamadı.")
        setLoadingItems(prev => ({ ...prev, [`subtask-${subtaskId}`]: false }))
        return
      }
      
      console.log(`Alt görev ID ${subtaskId} durumu ${newStateId} olarak güncelleniyor...`)
      
      // Önce güncellenecek alt görevi bulalım
      let subtaskToUpdate = null;
      let parentTaskId = null;
      let parentTask = null;
      
      // tasks içinde dön ve alt görevi bul
      for (const task of tasks) {
        const foundSubtask = task.subtasks ? task.subtasks.find(s => s.subtask_id === subtaskId) : null;
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
        setLoadingItems(prev => ({ ...prev, [`subtask-${subtaskId}`]: false }))
        return;
      }
      
      // Alt görev tamamlanıyor ama alt görev başlatılmamışsa, önce başlatılmalı
      if (newStateId === 3 && subtaskToUpdate.state_id === 1) {
        setError("Alt görev önce başlatılmalı, sonra tamamlanmalıdır!");
        setLoadingItems(prev => ({ ...prev, [`subtask-${subtaskId}`]: false }))
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
      const response = await fetch(`${API_KEY}/Subtask/update_subtask`, {
        method: "PUT", // PUT metodunu kullan
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subtaskData)
      });
      
      if (!response.ok) {
        throw new Error(`Alt görev durumu güncellenirken hata: ${await response.text()}`);
      }
      
      console.log("Alt görev durumu başarıyla güncellendi");
      
      // Bu işlemden sonra verileri yeniden yükleyelim
      await loadTasksData();
      
      // Ana görevi kontrol et - eğer bu güncellenen alt görev tamamlandı durumdaysa
      // Burada güncel veriyi kullanmak için, veri yenilendikten sonra tekrar görevi ve alt görevleri bulalım
      if (newStateId === 3) {
        // Güncel görev verilerini yeniden alalım
        const updatedParentTask = tasks.find(t => t.task_id === parentTaskId);
        
        if (updatedParentTask && updatedParentTask.subtasks) {
          // Tüm alt görevlerin tamamlanıp tamamlanmadığını kontrol edelim
          const allCompleted = updatedParentTask.subtasks.every(st => st.state_id === 3);
          
          if (allCompleted) {
            console.log(`Tüm alt görevler tamamlandı. Ana görev ID ${parentTaskId} tamamlandı olarak işaretleniyor...`);
            await updateTaskState(parentTaskId, 3);
          }
        }
      }
      
    } catch (error) {
      console.error("Alt görev durumu güncellenirken hata:", error);
      setError(`Alt görev durumu güncellenirken bir hata oluştu: ${error.message}`);
    } finally {
      // Yükleme durumunu kaldır
      setLoadingItems(prev => ({ ...prev, [`subtask-${subtaskId}`]: false }))
    }
  };
  
  // Alt görev ekleme formunu göstermek için yeni state ekleyelim
  const resetSubtaskForm = () => {
    setNewSubtaskForExistingTask({
      title: "",
      description: "",
      assignee: null,
      startDate: "",
      endDate: "",
      difficulty: "orta"
    })
  }
  
  // Alt görev formunu gösterme fonksiyonu
  const openAddSubtaskForm = (taskId) => {
    setSelectedTaskId(taskId)
    resetSubtaskForm()
    setShowAddSubtaskForm(true)
  }
  
  // Mevcut göreve yeni alt görev ekleme fonksiyonu
  const handleAddSubtaskToExistingTask = async () => {
    try {
      if (!selectedTaskId) {
        toast.error("Hata oluştu. Lütfen tekrar deneyin.")
        return
      }
      
      // Seçilen görevi bul
      const selectedTask = tasks.find(t => t.task_id === selectedTaskId)
      if (!selectedTask) {
        toast.error("Görev bulunamadı. Lütfen sayfayı yenileyin.")
        return
      }
      
      // Form doğrulama
      if (!newSubtaskForExistingTask.title.trim()) {
        toast.error("Alt görev adı gereklidir")
        return
      }
      
      if (!newSubtaskForExistingTask.description.trim()) {
        toast.error("Alt görev açıklaması gereklidir")
        return
      }
      
      if (!newSubtaskForExistingTask.assignee) {
        toast.error("Alt görev için bir görevli seçilmelidir")
        return
      }
      
      if (!newSubtaskForExistingTask.startDate) {
        toast.error("Başlangıç tarihi gereklidir")
        return
      }
      
      if (!newSubtaskForExistingTask.endDate) {
        toast.error("Bitiş tarihi gereklidir")
        return
      }
      
      // Tarih kontrolü
      const startDate = new Date(newSubtaskForExistingTask.startDate)
      const endDate = new Date(newSubtaskForExistingTask.endDate)
      
      if (endDate < startDate) {
        toast.error("Bitiş tarihi başlangıç tarihinden önce olamaz")
        return
      }
      
      setLoading(true)
      
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Oturum bilgisi bulunamadı")
        setLoading(false)
        return
      }
      
      // Zorluk seviyesi (level_id) değerini belirle
      let subtaskLevelId = 2 // Varsayılan orta
      if (newSubtaskForExistingTask.difficulty === "kolay") subtaskLevelId = 1
      else if (newSubtaskForExistingTask.difficulty === "zor") subtaskLevelId = 3
      
      // Alt görev verisi hazırla
      const subtaskData = {
        token,
        subtasks: [{
          task_id: selectedTaskId,
          state_id: 1, // Başlangıçta yapılmadı
          level_id: subtaskLevelId,
          title: newSubtaskForExistingTask.title,
          description: newSubtaskForExistingTask.description
        }]
      }
      
      // Alt görev oluşturma API isteği
      const subtaskResponse = await fetch(`${API_KEY}/Subtask/create_subtask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subtaskData),
      })
      
      if (!subtaskResponse.ok) {
        throw new Error("Alt görev eklenirken bir hata oluştu")
      }
      
      const subtaskResult = await subtaskResponse.json()
      
      // Görevliyi ata
      if (subtaskResult.created_subtask_ids && subtaskResult.created_subtask_ids.length > 0) {
        const subtaskId = subtaskResult.created_subtask_ids[0]
        
        if (newSubtaskForExistingTask.assignee && newSubtaskForExistingTask.assignee.id) {
          try {
            const assignmentResponse = await fetch(`${API_KEY}/SubtaskAssignment/create_subtask_assignment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                subtask_id: subtaskId,
                user_id: Number(newSubtaskForExistingTask.assignee.id)
              }),
            })
            
            if (!assignmentResponse.ok) {
              console.warn("Alt görev atama işlemi başarısız oldu:", await assignmentResponse.text())
            }
          } catch (error) {
            console.error("Alt görev atama işleminde hata:", error)
          }
        }
      }
      
      toast.success("Alt görev başarıyla eklendi!")
      setShowAddSubtaskForm(false)
      resetSubtaskForm()
      
      // Verileri yeniden yükle
      await loadTasksData()
      
    } catch (error) {
      console.error("Alt görev eklenirken hata:", error)
      toast.error(error.message || "Alt görev eklenirken bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }
  
  // Alt görev değişikliği izleme fonksiyonu - daha basit bir yaklaşım
  const handleExistingTaskSubtaskChange = (e) => {
    const { name, value } = e.target;
    setNewSubtaskForExistingTask(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // Select için özel bir fonksiyon
  const handleAssigneeChange = (selected) => {
    setNewSubtaskForExistingTask(prev => ({
      ...prev,
      assignee: selected
    }));
  }
  
  // TaskCard bileşenini güncelleyelim
  const TaskCard = ({ task }) => {
    const isExpanded = expandedTasks[task.task_id] || false;
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;
    
    // Silme onay modalı için state ekleyelim
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    // Alt görevlerin tamamlanma durumunu hesapla
    const completedSubtasks = hasSubtasks 
      ? task.subtasks.filter(st => st.state_id === 3).length 
      : 0;
    const totalSubtasks = hasSubtasks ? task.subtasks.length : 0;
    const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
    
    // Durum renklerini belirle
    const statusColors = {
      1: "border-l-4 border-gray-300",  // Yapılmadı
      2: "border-l-4 border-blue-300",  // Yapılıyor
      3: "border-l-4 border-green-300"  // Tamamlandı
    };
    
    // Bu görev için yükleme durumunu kontrol et
    const isLoading = loadingItems[`task-${task.task_id}`] === true;
    
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
          
          <div className="flex items-center ml-3">
            <div className="flex">
              {isLoading ? (
                <div className="mr-2 px-3 py-1.5 bg-gray-100 rounded-md text-xs text-gray-500 flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  İşleniyor...
                </div>
              ) : (
                <>
                  {role === "admin" && (
                    <>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(true);
                        }}
                        className="mr-2 px-3 py-1.5 bg-white border border-red-300 text-red-600 rounded-md text-xs hover:bg-red-50 transition-colors"
                        title="Görevi sil"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openAddSubtaskForm(task.task_id);
                        }}
                        className="mr-2 px-3 py-1.5 bg-white border border-indigo-300 text-indigo-600 rounded-md text-xs hover:bg-indigo-50 transition-colors"
                        title="Alt görev ekle"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                      </button>
                    </>
                  )}
                  
                  {task.state_id !== 2 && task.state_id !== 3 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTaskState(task.task_id, 2);
                      }}
                      className="mr-2 px-3 py-1.5 bg-white border border-blue-300 text-blue-600 rounded-md text-xs hover:bg-blue-50 transition-colors"
                      disabled={isLoading}
                    >
                      Başlat
                    </button>
                  )}
                  
                  {task.state_id !== 3 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTaskState(task.task_id, 3);
                      }}
                      className={`mr-2 px-3 py-1.5 bg-white border ${hasSubtasks && completedSubtasks < totalSubtasks ? 'border-gray-300 text-gray-400 cursor-not-allowed' : 'border-green-300 text-green-600 hover:bg-green-50'} rounded-md text-xs transition-colors`}
                      title={hasSubtasks && completedSubtasks < totalSubtasks ? "Tüm alt görevler tamamlanmadan ana görev tamamlanamaz" : ""}
                      disabled={hasSubtasks && completedSubtasks < totalSubtasks || isLoading}
                    >
                      Tamamla
                    </button>
                  )}
                </>
              )}
              
              {hasSubtasks && (
                <button 
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTask(task.task_id);
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
                {role === "admin" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openAddSubtaskForm(task.task_id);
                    }}
                    className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Alt Görev Ekle
                  </button>
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
        
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Görevi Silmeyi Onayla</h3>
              <p className="text-gray-500 mb-4">"{task.title}" görevini ve tüm alt görevlerini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(false);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.task_id);
                    setShowDeleteConfirm(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  

  const deleteTask = async (taskId) => {
    try {
      if (loadingItems[`task-${taskId}`]) {
        return;
      }
      
      setLoadingItems(prev => ({ ...prev, [`task-${taskId}`]: true }))
      
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Oturum bilgisi bulunamadı.")
        setLoadingItems(prev => ({ ...prev, [`task-${taskId}`]: false }))
        return
      }
      
      // API'ye silme isteği gönder
      const response = await fetch(`${API_KEY}/Task/delete_task`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          task_id: taskId
        })
      });
      
      if (!response.ok) {
        throw new Error(`Görev silinirken hata: ${await response.text()}`);
      }
      
      // Veriyi yeniden yükle
      await loadTasksData();
      toast.success("Görev başarıyla silindi");
      
    } catch (error) {
      console.error("Görev silinirken hata:", error);
      setError(`Görev silinirken bir hata oluştu: ${error.message}`);
    } finally {
      setLoadingItems(prev => ({ ...prev, [`task-${taskId}`]: false }))
    }
  };
  
  // Alt görev silme fonksiyonu deleteSubtask'i ekleyelim
  const deleteSubtask = async (subtaskId) => {
    try {
      if (loadingItems[`subtask-${subtaskId}`]) {
        return;
      }
      
      setLoadingItems(prev => ({ ...prev, [`subtask-${subtaskId}`]: true }))
      
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Oturum bilgisi bulunamadı.")
        setLoadingItems(prev => ({ ...prev, [`subtask-${subtaskId}`]: false }))
        return
      }
      
      // API'ye silme isteği gönder
      const response = await fetch(`${API_KEY}/Subtask/delete_subtask`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          subtask_id: subtaskId
        })
      });
      
      if (!response.ok) {
        throw new Error(`Alt görev silinirken hata: ${await response.text()}`);
      }
      
      // Veriyi yeniden yükle
      await loadTasksData();
      toast.success("Alt görev başarıyla silindi");
      
    } catch (error) {
      console.error("Alt görev silinirken hata:", error);
      setError(`Alt görev silinirken bir hata oluştu: ${error.message}`);
    } finally {
      setLoadingItems(prev => ({ ...prev, [`subtask-${subtaskId}`]: false }))
    }
  };
  
  // SubtaskCard bileşenini güncelleyelim ve silme butonunu ekleyelim
  const SubtaskCard = ({ subtask, updateSubtaskState, parentTask }) => {
    // Yükleme durumunu kontrol et
    const isLoading = loadingItems[`subtask-${subtask.subtask_id}`] === true;
    
    // Silme onay modalı için state ekleyelim
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    // Durum renklerini belirle
    const statusColors = {
      1: "bg-gray-50", // Yapılmadı
      2: "bg-blue-50", // Yapılıyor
      3: "bg-green-50" // Tamamlandı
    };
    
    return (
      <div className={`mb-2 p-2 rounded-lg border border-gray-200 ${statusColors[subtask.state_id]}`}>
        <div className="flex justify-between items-center">
          <div className="flex-grow">
            <h5 className="text-sm font-medium text-gray-800">{subtask.title}</h5>
            {subtask.description && (
              <p className="mt-1 text-xs text-gray-600">{subtask.description}</p>
            )}
            <div className="mt-1 flex text-xs text-gray-500">
              {subtask.start_time && (
                <div className="flex items-center mr-3">
                  <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                  <span>{new Date(subtask.start_time).toLocaleDateString('tr-TR')}</span>
                </div>
              )}
              {subtask.end_time && (
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-gray-400" />
                  <span>{new Date(subtask.end_time).toLocaleDateString('tr-TR')}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Durum değiştirme butonları */}
          <div className="flex items-center">
            {isLoading ? (
              <div className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-500 flex items-center">
                <svg className="animate-spin mr-1 h-3 w-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                İşleniyor...
              </div>
            ) : (
              <>
                {/* Silme butonu (sadece admin için) */}
                {role === "admin" && (
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="mr-1 px-2 py-1 bg-white border border-red-300 text-red-600 rounded-md text-xs hover:bg-red-50 transition-colors"
                    title="Alt görevi sil"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                )}
                
                {parentTask.state_id !== 1 && (
                  <>
                    {subtask.state_id === 1 && (
                      <button
                        onClick={() => updateSubtaskState(subtask.subtask_id, 2)}
                        className="mr-1 px-2 py-1 bg-white border border-blue-300 text-blue-600 rounded-md text-xs hover:bg-blue-50 transition-colors"
                        disabled={isLoading || parentTask.state_id === 1}
                      >
                        Başlat
                      </button>
                    )}
                    
                    {subtask.state_id === 2 && (
                      <button
                        onClick={() => updateSubtaskState(subtask.subtask_id, 3)}
                        className="mr-1 px-2 py-1 bg-white border border-green-300 text-green-600 rounded-md text-xs hover:bg-green-50 transition-colors"
                        disabled={isLoading}
                      >
                        Tamamla
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Alt görev silme onay modalı */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Alt Görevi Silmeyi Onayla</h3>
              <p className="text-gray-500 mb-4">"{subtask.title}" alt görevini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    deleteSubtask(subtask.subtask_id);
                    setShowDeleteConfirm(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // TaskList bileşeni - alt görevleri ana görev kartında gösterecek şekilde düzeltildi
  const TaskList = ({ items, title, icon, color }) => {
    if (!items || items.length === 0) {
      return (
        <div className={`p-4 rounded-xl ${color}`}>
          <div className="flex items-center mb-4">
            {icon}
            <h4 className="ml-2 font-medium">{title}</h4>
            <div className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs text-gray-500">0</div>
          </div>
          <div className="py-8 flex flex-col items-center justify-center text-gray-400 text-sm">
            <svg className="w-10 h-10 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Bu kolonda görev bulunmuyor
          </div>
        </div>
      );
    }

    // Sadece ana görevleri filtrele (type=task olanları)
    const mainTasks = items.filter(item => item.type === 'task');

    return (
      <div className={`p-4 rounded-xl ${color}`}>
        <div className="flex items-center mb-4">
          {icon}
          <h4 className="ml-2 font-medium">{title}</h4>
          <div className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs text-gray-500">{mainTasks.length}</div>
        </div>
        <div className="space-y-3">
          {mainTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    );
  };

  // Modalı kaldırıp doğrudan ekrandaki öğelerin altına ekleyeceğimiz için
  // AddSubtaskForm bileşenini güncelleyelim (önceki AddSubtaskModal yerine)
  const AddSubtaskForm = () => {
    if (!showAddSubtaskForm) return null
    
    // Seçilen görevi bul
    const selectedTask = tasks.find(t => t.task_id === selectedTaskId)
    if (!selectedTask) return null

    const handleFormSubmit = () => {
      // Form doğrulama - state değerlerini kullan (artık ref kullanmıyoruz)
      if (!newSubtaskForExistingTask.title.trim()) {
        toast.error("Alt görev adı gereklidir");
        return;
      }
      
      if (!newSubtaskForExistingTask.description.trim()) {
        toast.error("Alt görev açıklaması gereklidir");
        return;
      }
      
      if (!newSubtaskForExistingTask.assignee) {
        toast.error("Alt görev için bir görevli seçilmelidir");
        return;
      }
      
      if (!newSubtaskForExistingTask.startDate) {
        toast.error("Başlangıç tarihi gereklidir");
        return;
      }
      
      if (!newSubtaskForExistingTask.endDate) {
        toast.error("Bitiş tarihi gereklidir");
        return;
      }
      
      // Doğrudan API çağrısını yap - state zaten güncel
      handleAddSubtaskToExistingTask();
    };
    
    return (
      <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-900">"{selectedTask.title}" için Alt Görev Ekle</h4>
          <button 
            onClick={() => setShowAddSubtaskForm(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alt Görev Adı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={newSubtaskForExistingTask.title}
              onChange={handleExistingTaskSubtaskChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Alt görev adını girin"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Görevli <span className="text-red-500">*</span>
            </label>
            <select
              value={newSubtaskForExistingTask.assignee ? newSubtaskForExistingTask.assignee.id : ""}
              onChange={(e) => {
                const userId = e.target.value ? Number(e.target.value) : null
                const selected = userId ? allUsers.find(user => user.id === userId) : null
                handleAssigneeChange(selected)
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Görevli Seç</option>
              {allUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} {user.surname}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Açıklama <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={newSubtaskForExistingTask.description}
            onChange={handleExistingTaskSubtaskChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Alt görev açıklaması"
            rows="3"
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Başlangıç Tarihi <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={newSubtaskForExistingTask.startDate}
              onChange={handleExistingTaskSubtaskChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bitiş Tarihi <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={newSubtaskForExistingTask.endDate}
              onChange={handleExistingTaskSubtaskChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zorluk
            </label>
            <select
              name="difficulty"
              value={newSubtaskForExistingTask.difficulty}
              onChange={handleExistingTaskSubtaskChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="kolay">Kolay</option>
              <option value="orta">Orta</option>
              <option value="zor">Zor</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => setShowAddSubtaskForm(false)}
            className="mr-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleFormSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ekleniyor...
              </div>
            ) : "Alt Görevi Ekle"}
          </button>
        </div>
      </div>
    )
  };

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
                  <div className="flex items-center gap-2">
                    {/* Admin için yeni görev ekleme butonu */}
                    {role === "admin" && (
                      <button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                        onClick={() => setShowAddTaskForm(true)}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Görev Ekle
                      </button>
                    )}
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500 bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
                      onClick={onClose}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Görev ekleme formu */}
                {showAddTaskForm && role === "admin" && (
                  <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Yeni Görev Ekle</h4>
                      <button 
                        onClick={() => setShowAddTaskForm(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Görev Adı <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={newTask.title}
                          onChange={handleTaskChange}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Görev adını girin"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Zorluk Seviyesi
                        </label>
                        <select
                          name="difficulty"
                          value={newTask.difficulty}
                          onChange={handleTaskChange}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="kolay">Kolay</option>
                          <option value="orta">Orta</option>
                          <option value="zor">Zor</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Görev Açıklaması <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={newTask.description}
                        onChange={handleTaskChange}
                        rows="3"
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Görev detaylarını girin"
                      ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Başlangıç Tarihi <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={newTask.startDate}
                          onChange={handleTaskChange}
                          min={today}
                          max={maxDate}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bitiş Tarihi <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={newTask.endDate}
                          onChange={handleTaskChange}
                          min={newTask.startDate || today}
                          max={maxDate}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    {/* Alt görevler bölümü */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium text-gray-700">Alt Görevler</h5>
                        <button
                          type="button"
                          onClick={handleAddSubtask}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        >
                          + Alt Görev Ekle
                        </button>
                      </div>
                      
                      {newSubtasks.map((subtask, index) => (
                        <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <h6 className="text-sm font-medium">Alt Görev #{index + 1}</h6>
                            {newSubtasks.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSubtask(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Alt Görev Adı <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={subtask.title}
                                onChange={(e) => handleSubtaskChange(index, 'title', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Alt görev adını girin"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Görevli <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={subtask.assignee ? subtask.assignee.id : ""}
                                onChange={(e) => {
                                  const userId = e.target.value ? Number(e.target.value) : null
                                  const selected = userId ? allUsers.find(user => user.id === userId) : null
                                  handleSubtaskChange(index, 'assignee', selected)
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Görevli Seç</option>
                                {allUsers.map(user => (
                                  <option key={user.id} value={user.id}>
                                    {user.name} {user.surname}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Açıklama <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              value={subtask.description}
                              onChange={(e) => handleSubtaskChange(index, 'description', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Alt görev açıklaması"
                              rows="2"
                            ></textarea>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Başlangıç Tarihi <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="date"
                                value={subtask.startDate}
                                onChange={(e) => handleSubtaskChange(index, 'startDate', e.target.value)}
                                min={newTask.startDate || today}
                                max={newTask.endDate || maxDate}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Bitiş Tarihi <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="date"
                                value={subtask.endDate}
                                onChange={(e) => handleSubtaskChange(index, 'endDate', e.target.value)}
                                min={subtask.startDate || newTask.startDate || today}
                                max={newTask.endDate || maxDate}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Zorluk
                              </label>
                              <select
                                value={subtask.difficulty}
                                onChange={(e) => handleSubtaskChange(index, 'difficulty', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="kolay">Kolay</option>
                                <option value="orta">Orta</option>
                                <option value="zor">Zor</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <button
                        type="button"
                        onClick={() => setShowAddTaskForm(false)}
                        className="mr-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        İptal
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveTask}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Görevi Kaydet
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Alt görev ekleme formu - Artık bir modal değil, görevlerden önce gösteriliyor */}
                {showAddSubtaskForm && <AddSubtaskForm />}
                
                {/* Mevcut görev listesi */}
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
                    <p className="mt-2 text-gray-400">
                      {role === "admin" 
                        ? "Yeni görev eklemek için yukarıdaki 'Görev Ekle' butonunu kullanabilirsiniz" 
                        : "Proje yöneticisi görev ekleyince burada görüntülenecek"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TaskList 
                      items={columns.todo.items} 
                      title="Yapılmadı" 
                      icon={<Clock className="w-5 h-5 text-gray-600" />} 
                      color="bg-gray-50" 
                    />
                    <TaskList 
                      items={columns.inProgress.items} 
                      title="Yapılıyor"
                      icon={<AlertCircle className="w-5 h-5 text-blue-600" />}
                      color="bg-blue-50" 
                    />
                    <TaskList 
                      items={columns.done.items} 
                      title="Tamamlandı"
                      icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                      color="bg-green-50" 
                    />
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
      <ToastContainer />
    </Transition>
  )
}
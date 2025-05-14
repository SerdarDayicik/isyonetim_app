"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { toast } from "react-toastify"
import { Calendar, DollarSign, FileText, Users, CheckCircle, Clock, Briefcase, Search, X } from "lucide-react"
import { AuthContext } from "../context/AuthContext"

export function ProjectCreate() {
  // API'den çekilecek kullanıcılar için state
  const API_KEY = process.env.REACT_APP_API_URL

  const [users, setUsers] = useState([])

  // formData state'ini güncelleyin ve tasks ekleyin
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    client: "",
    startDate: "",
    deadline: "",
    budget: "",
    priority: "orta",
    projectType: "web",
    teamMembers: [],
    broker: "", 
    tasks: [] // Görevler için yeni alan
  })

  const [selectedTeamMembers, setSelectedTeamMembers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showTeamResults, setShowTeamResults] = useState(false)

  // Komisyoncu arama için state ekleyin
  const [brokerSearchTerm, setBrokerSearchTerm] = useState("")
  const [selectedBroker, setSelectedBroker] = useState(null)
  const [showBrokerResults, setShowBrokerResults] = useState(false)

  // Müşteri arama için state ekleyin
  const [clientSearchTerm, setClientSearchTerm] = useState("")
  const [showClientResults, setShowClientResults] = useState(false)
  const clientSearchRef = useRef(null)

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Referanslar
  const teamSearchRef = useRef(null)
  const brokerSearchRef = useRef(null)

  // Görevler için yeni state'ler ekleyin
  const [tasks, setTasks] = useState([])
  const [newTaskName, setNewTaskName] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("") // Yeni açıklama alanı
  const [newTaskDifficulty, setNewTaskDifficulty] = useState("orta") // Yeni zorluk alanı
  const [newTaskStartDate, setNewTaskStartDate] = useState("") // Yeni başlangıç tarihi
  const [newTaskEndDate, setNewTaskEndDate] = useState("") // Yeni bitiş tarihi
  const [newSubtasks, setNewSubtasks] = useState([{ 
    name: "", 
    assignee: null,
    description: "",
    startDate: "",
    endDate: "",
    difficulty: "orta"
  }])

  // AuthContext'ten token alınması
  const { token } = useContext(AuthContext)

  // Öncelikle tarih aralıklarını hesaplayan yardımcı fonksiyonlar ekleyelim
  const getFormattedDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Bugünün tarihini al
  const today = getFormattedDate(new Date());

  // Maksimum 10 yıl sonraki tarihi hesapla
  const maxDate = getFormattedDate(new Date(new Date().setFullYear(new Date().getFullYear() + 10)));

  // API'den kullanıcıları çek
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_KEY}/User/get_users`)
        if (response.ok) {
          const data = await response.json()
          // Her kullanıcıya id ekle ve verileri düzgün string formatına dönüştür
          const usersWithId = data.map((user) => ({
            ...user,
            id: user.id, // API'den gelen id değerini kullan
            name: String(user.name || ""), // String'e dönüştür
            surname: String(user.surname || ""),
            fullName: `${user.name || ""} ${user.surname || ""}`.trim(), // Tam adını oluştur
            email: String(user.email || ""),
            phone: String(user.phone || ""),
            role: String(user.role || "Kullanıcı"),
            avatar: user.profile_photo_url || 
              `https://ui-avatars.com/api/?name=${encodeURIComponent(`${user.name || ""} ${user.surname || ""}`)}&background=random`,
            company: "Şirket Belirtilmedi" // Varsayılan şirket
          }))
          
          console.log("Düzenlenmiş kullanıcı verileri:", usersWithId)
          setUsers(usersWithId)
        } else {
          console.error("Kullanıcıları getirirken hata oluştu")
          toast.error("Kullanıcı listesi yüklenemedi!")
        }
      } catch (error) {
        console.error("Kullanıcıları getirirken hata:", error)
        toast.error("Kullanıcı listesi yüklenemedi!")
      }
    }

    fetchUsers()
  }, [])

  // Dışarı tıklandığında sonuçları kapat
  useEffect(() => {
    function handleClickOutside(event) {
      if (teamSearchRef.current && !teamSearchRef.current.contains(event.target)) {
        setShowTeamResults(false)
      }
      if (brokerSearchRef.current && !brokerSearchRef.current.contains(event.target)) {
        setShowBrokerResults(false)
      }
      if (clientSearchRef.current && !clientSearchRef.current.contains(event.target)) {
        setShowClientResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Hata varsa temizle
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleTeamMemberSelect = (member) => {
    if (!selectedTeamMembers.some((m) => m.id === member.id)) {
      setSelectedTeamMembers((prev) => [...prev, member])
      setFormData((prev) => ({ ...prev, teamMembers: [...prev.teamMembers, member.id] }))
    }
    setSearchTerm("")
    setShowTeamResults(false)
  }

  const handleTeamMemberRemove = (memberId) => {
    setSelectedTeamMembers((prev) => prev.filter((m) => m.id !== memberId))
    setFormData((prev) => ({ ...prev, teamMembers: prev.teamMembers.filter((id) => id !== memberId) }))
  }

  // Komisyoncu seçimi için fonksiyon ekleyin
  const handleBrokerSelect = (broker) => {
    setSelectedBroker(broker)
    setFormData((prev) => ({ ...prev, broker: broker.id }))
    setBrokerSearchTerm("")
    setShowBrokerResults(false)
  }

  // Komisyoncu kaldırma için fonksiyon ekleyin
  const handleBrokerRemove = () => {
    setSelectedBroker(null)
    setFormData((prev) => ({ ...prev, broker: "" }))
  }

  // Filtrelenmiş ekip üyeleri
  const filteredTeamMembers = users.filter(
    (member) =>
      ((member.name && typeof member.name === 'string' && member.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
       (member.surname && typeof member.surname === 'string' && member.surname.toLowerCase().includes(searchTerm.toLowerCase())) ||
       (member.fullName && typeof member.fullName === 'string' && member.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
       (member.role && typeof member.role === 'string' && member.role.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      !selectedTeamMembers.some((m) => m.id === member.id)
  )

  // Filtrelenmiş komisyoncu listesi
  const filteredBrokers = users.filter(
    (broker) =>
      ((broker.name && typeof broker.name === 'string' && broker.name.toLowerCase().includes(brokerSearchTerm.toLowerCase())) ||
       (broker.surname && typeof broker.surname === 'string' && broker.surname.toLowerCase().includes(brokerSearchTerm.toLowerCase())) ||
       (broker.fullName && typeof broker.fullName === 'string' && broker.fullName.toLowerCase().includes(brokerSearchTerm.toLowerCase())) ||
       (broker.company && typeof broker.company === 'string' && broker.company.toLowerCase().includes(brokerSearchTerm.toLowerCase()))) &&
      (!selectedBroker || broker.id !== selectedBroker.id)
  )

  // Filtrelenmiş müşteriler
  const filteredClients = users.filter(
    (client) =>
      ((client.name && typeof client.name === 'string' && client.name.toLowerCase().includes(clientSearchTerm.toLowerCase())) ||
       (client.surname && typeof client.surname === 'string' && client.surname.toLowerCase().includes(clientSearchTerm.toLowerCase())) ||
       (client.fullName && typeof client.fullName === 'string' && client.fullName.toLowerCase().includes(clientSearchTerm.toLowerCase())) ||
       (client.company && typeof client.company === 'string' && client.company.toLowerCase().includes(clientSearchTerm.toLowerCase())))
  )

  // Tarihleri doğrulayan fonksiyonu güncelleyelim
  const validateDates = (startDate, endDate, errorMessages = {}) => {
    if (!startDate) {
      errorMessages.startDate = "Başlangıç tarihi gereklidir";
    }
    
    if (!endDate) {
      errorMessages.endDate = "Bitiş tarihi gereklidir";
    } else if (startDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      
      if (endDateObj < startDateObj) {
        errorMessages.endDate = "Bitiş tarihi başlangıç tarihinden önce olamaz";
      }
    }
    
    return errorMessages;
  };

  // Proje form doğrulama fonksiyonunu güncelle
  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectName.trim()) newErrors.projectName = "Proje adı gereklidir";
    if (!formData.description.trim()) newErrors.description = "Proje açıklaması gereklidir";
    if (!formData.client.trim()) newErrors.client = "Müşteri adı gereklidir";
    
    // Tarih doğrulama
    validateDates(formData.startDate, formData.deadline, newErrors);
    
    if (!formData.budget.trim()) newErrors.budget = "Bütçe gereklidir";
    if (isNaN(Number(formData.budget))) newErrors.budget = "Bütçe sayısal bir değer olmalıdır";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Görev doğrulama fonksiyonunu güncelle
  const validateTask = (task) => {
    const errors = [];
    if (!task.name.trim()) errors.push("Görev adı boş bırakılamaz");
    if (!task.description || !task.description.trim()) errors.push("Görev açıklaması boş bırakılamaz");
    
    // Tarih doğrulama
    const dateErrors = {};
    validateDates(task.startDate, task.endDate, dateErrors);
    
    if (dateErrors.startDate) errors.push(`Görev: ${dateErrors.startDate}`);
    if (dateErrors.endDate) errors.push(`Görev: ${dateErrors.endDate}`);
    
    // Alt görevleri kontrol et
    if (task.subtasks && task.subtasks.length > 0) {
      task.subtasks.forEach((subtask, index) => {
        if (!subtask.name.trim()) errors.push(`Alt görev #${index+1}: Ad boş bırakılamaz`);
        if (!subtask.description || !subtask.description.trim()) errors.push(`Alt görev #${index+1}: Açıklama boş bırakılamaz`);
        if (!subtask.assignee) errors.push(`Alt görev #${index+1}: Görevli seçilmelidir`);
        
        // Alt görev tarih doğrulama
        const subtaskDateErrors = {};
        validateDates(subtask.startDate, subtask.endDate, subtaskDateErrors);
        
        if (subtaskDateErrors.startDate) errors.push(`Alt görev #${index+1}: ${subtaskDateErrors.startDate}`);
        if (subtaskDateErrors.endDate) errors.push(`Alt görev #${index+1}: ${subtaskDateErrors.endDate}`);
        
        // Yalnızca alt görev bitiş tarihi görev bitiş tarihini geçmesin
        if (subtask.endDate && task.endDate) {
          const subtaskEnd = new Date(subtask.endDate);
          const taskEnd = new Date(task.endDate);
          if (subtaskEnd > taskEnd) {
            errors.push(`Alt görev #${index+1}: Bitiş tarihi görev bitiş tarihinden sonra olamaz`);
          }
        }
      });
    }
    
    return errors;
  };

  // Butonun disabled durumunu kontrol etmek için yeni bir fonksiyon ekleyin
  // validateForm fonksiyonundan sonra ve handleSubmit fonksiyonundan önce ekleyin:

  const isFormComplete = () => {
    return (
      formData.projectName.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.client.trim() !== "" &&
      formData.startDate !== "" &&
      formData.deadline !== "" &&
      formData.budget.trim() !== "" &&
      !isNaN(Number(formData.budget)) &&
      selectedTeamMembers.length > 0 &&
      selectedBroker !== null
    )
  }

  // Sonra handleAddTask fonksiyonunu güncelleyelim
  const handleAddTask = () => {
    if (!newTaskName.trim()) return;
    
    const newTask = {
      name: newTaskName,
      description: newTaskDescription,
      difficulty: newTaskDifficulty,
      startDate: newTaskStartDate,
      endDate: newTaskEndDate,
      subtasks: newSubtasks.filter(subtask => subtask.name.trim() !== "")
    };
    
    // Görev ve alt görevleri doğrula
    const validationErrors = validateTask(newTask);
    
    if (validationErrors.length > 0) {
      // Hataları göster
      toast.error(
        <div>
          <p className="font-bold mb-2">Lütfen aşağıdaki alanları doldurun:</p>
          <ul className="list-disc pl-5">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>,
        {
          autoClose: 5000, // 5 saniye göster
          closeOnClick: true,
        }
      );
      return;
    }
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setFormData(prev => ({ ...prev, tasks: updatedTasks }));
    
    // Form temizleme
    setNewTaskName("");
    setNewTaskDescription("");
    setNewTaskDifficulty("orta");
    setNewTaskStartDate("");
    setNewTaskEndDate("");
    setNewSubtasks([{ 
      name: "", 
      assignee: null,
      description: "",
      startDate: "",
      endDate: "",
      difficulty: "orta"
    }]);
  };

  // Alt görev eklemek için fonksiyon
  const handleAddSubtask = () => {
    setNewSubtasks([...newSubtasks, { 
      name: "", 
      assignee: null,
      description: "",
      startDate: "",
      endDate: "",
      difficulty: "orta"
    }])
  }

  // Alt görev değişimini izlemek için fonksiyon
  const handleSubtaskChange = (index, field, value) => {
    const updatedSubtasks = [...newSubtasks]
    updatedSubtasks[index][field] = value
    setNewSubtasks(updatedSubtasks)
  }

  // Alt görev silme fonksiyonu
  const handleRemoveSubtask = (index) => {
    const updatedSubtasks = [...newSubtasks]
    updatedSubtasks.splice(index, 1)
    setNewSubtasks(updatedSubtasks)
  }

  // Görev silme fonksiyonu
  const handleRemoveTask = (index) => {
    const updatedTasks = [...tasks]
    updatedTasks.splice(index, 1)
    setTasks(updatedTasks)
    setFormData(prev => ({ ...prev, tasks: updatedTasks }))
  }

  // Zorluk renklerini ve metinlerini belirle
  const getDifficultyDetails = (difficulty) => {
    switch (difficulty) {
      case "kolay":
        return { color: "bg-green-100 text-green-800", text: "Kolay" }
      case "orta":
        return { color: "bg-blue-100 text-blue-800", text: "Orta" }
      case "zor":
        return { color: "bg-orange-100 text-orange-800", text: "Zor" }
      default:
        return { color: "bg-gray-100 text-gray-800", text: "Belirsiz" }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    // Görevleri doğrula
    if (tasks.length > 0) {
      const taskErrors = []
      
      tasks.forEach((task, taskIndex) => {
        const errors = validateTask(task)
        if (errors.length > 0) {
          taskErrors.push({
            taskName: task.name,
            errors: errors
          })
        }
      })
      
      if (taskErrors.length > 0) {
        // Görevlerde hata var, uyarı göster
        toast.error(
          <div>
            <p className="font-bold mb-2">Görevlerde eksik bilgiler var:</p>
            {taskErrors.map((taskError, index) => (
              <div key={index} className="mb-2">
                <p className="font-semibold">{taskError.taskName || `Görev #${index+1}`}:</p>
                <ul className="list-disc pl-5">
                  {taskError.errors.map((error, errorIndex) => (
                    <li key={errorIndex}>{error}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>,
          {
            autoClose: false, // Manuel kapatılana kadar göster
            closeOnClick: true,
          }
        )
        return
      }
    }

    setIsLoading(true)

    try {
      // localStorage'dan token'ı al
      const token = localStorage.getItem("token")
      
      if (!token) {
        toast.error("Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.")
        return
      }

      // Proje API için veri hazırla
      const projectData = {
        project_name: formData.projectName,
        price: Number.parseFloat(formData.budget),
        description: formData.description,
        invitees: selectedTeamMembers.map((member) => member.name),
        brokers: selectedBroker ? [selectedBroker.name] : [],
        customers: clientSearchTerm ? [clientSearchTerm] : [],
        start_date: formData.startDate,
        deadline: formData.deadline,
        priority: formData.priority,
        project_type: formData.projectType,
      }

      // Proje oluşturma API isteği
      const projectResponse = await fetch(`${API_KEY}/Project/create_project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      // Proje yanıtını kontrol et
      if (!projectResponse.ok) {
        const errorData = await projectResponse.json().catch(() => ({}))
        throw new Error(errorData.message || "Proje oluşturulurken bir hata oluştu")
      }

      // Project ID'yi al
      const projectResult = await projectResponse.json()
      const projectId = projectResult.project_id
      
      console.log("Proje ID:", projectId)

      // Şimdi her görev için API isteği yap ve task_id'leri sakla
      if (tasks.length > 0) {
        // Task ID'leri ve ilgili alt görevleri takip etmek için bir dizi oluşturalım
        const taskResults = await Promise.all(
          tasks.map(async (task, index) => {
            // Zorluk seviyesi (level_id) değerini belirle
            let levelId = 2 // Varsayılan orta
            if (task.difficulty === "kolay") levelId = 1
            else if (task.difficulty === "zor") levelId = 3

            // Task için API verisi hazırla
            const taskData = {
              token: token,
              project_id: projectId,
              state_id: 1, // Her zaman 1 olacak
              level_id: levelId,
              title: task.name,
              description: task.description || ""
            }

            console.log(`Görev ${index + 1} API'ye gönderiliyor:`, taskData);
            console.log(`Bu görevin ${task.subtasks?.length || 0} alt görevi var`);

            try {
              // Görev oluşturma API isteği
              const taskResponse = await fetch(`${API_KEY}/Task/create_task`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(taskData),
              })

              if (!taskResponse.ok) {
                const errorData = await taskResponse.json().catch(() => ({}))
                console.error("Görev eklenirken hata:", errorData.error || "Bilinmeyen hata")
                return { success: false, task: task, error: errorData.error }
              }

              // Başarılı yanıtı al ve task_id değerini çıkart
              const taskResult = await taskResponse.json()
              const taskId = taskResult.task_id
              
              console.log(`Görev başarıyla oluşturuldu. Görev ID: ${taskId}`);
              
              return { 
                success: true, 
                task: task, 
                taskId: taskId,
                hasSubtasks: task.subtasks && task.subtasks.length > 0
              }
            } catch (error) {
              console.error("Görev eklenirken hata:", error)
              return { success: false, task: task, error: error.message }
            }
          })
        )

        // Şimdi her başarılı görev için alt görevleri ekleyelim
        const subtasksToAdd = []

        for (const result of taskResults) {
          if (result.success && result.taskId && result.task.subtasks && result.task.subtasks.length > 0) {
            console.log(`Görev ID ${result.taskId} için ${result.task.subtasks.length} alt görev bulundu`);
            
            // Her bir alt görev için veri oluşturup listeye ekleyelim
            result.task.subtasks.forEach(subtask => {
              // Zorluk seviyesi (level_id) değerini belirle
              let levelId = 2 // Varsayılan orta
              if (subtask.difficulty === "kolay") levelId = 1
              else if (subtask.difficulty === "zor") levelId = 3
              
              subtasksToAdd.push({
                task_id: result.taskId,
                state_id: 1, // Her zaman 1 olacak
                level_id: levelId,
                title: subtask.name,
                description: subtask.description || ""
              })
            })
          } else {
            console.log("Alt görev ekleme atlandı:", {
              başarılı: result.success, 
              görevID: result.taskId, 
              altGörevVar: result.task.subtasks && result.task.subtasks.length > 0,
              altGörevSayısı: result.task.subtasks ? result.task.subtasks.length : 0
            });
          }
        }

        // Alt görevler varsa bunları tek seferde gönderelim
        if (subtasksToAdd.length > 0) {
          console.log(`Toplam ${subtasksToAdd.length} alt görev için istek gönderiliyor...`);
          console.log("Alt görev verileri:", subtasksToAdd);
          
          try {
            const subtaskResponse = await fetch(`${API_KEY}/Subtask/create_subtask`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: token,
                subtasks: subtasksToAdd
              }),
            });
            
            console.log(`Alt görev API yanıtı:`, subtaskResponse.status, subtaskResponse.statusText);
            
            if (!subtaskResponse.ok) {
              const errorData = await subtaskResponse.json().catch(() => ({}));
              console.error(`Alt görevler eklenirken hata:`, errorData);
            } else {
              const responseData = await subtaskResponse.json().catch(() => ({}));
              console.log(`${subtasksToAdd.length} alt görev başarıyla oluşturuldu. Yanıt:`, responseData);
              
              // Alt görev ID'lerini ve atanan kullanıcıları eşleştirme
              if (responseData && responseData.created_subtask_ids && Array.isArray(responseData.created_subtask_ids)) {
                const subtaskAssignments = [];
                
                let subtaskIndex = 0;
                for (const result of taskResults) {
                  if (result.success && result.task.subtasks && result.task.subtasks.length > 0) {
                    for (const subtask of result.task.subtasks) {
                      // Eğer subtask'e bir kullanıcı atanmışsa
                      if (subtask.assignee && subtask.assignee.id) {
                        // responseData.created_subtask_ids dizisinde sırasıyla oluşturulan alt görevlerin ID'leri var
                        if (subtaskIndex < responseData.created_subtask_ids.length) {
                          const subtaskId = responseData.created_subtask_ids[subtaskIndex];
                          
                          // Kullanıcı ID'sinin sayı olduğundan emin olalım
                          const userId = Number(subtask.assignee.id);
                          
                          console.log("Atamada kullanılacak kullanıcı:", {
                            assignee: subtask.assignee,
                            id: subtask.assignee.id,
                            type: typeof subtask.assignee.id,
                            parsedId: userId
                          });
                          
                          subtaskAssignments.push({
                            subtask_id: subtaskId,
                            user_id: userId
                          });
                          
                          console.log(`Atama yapılacak: Alt görev ID: ${subtaskId}, Kullanıcı ID: ${userId}`);
                        }
                      }
                      subtaskIndex++;
                    }
                  }
                }
                
                // Şimdi atama isteklerini gönderelim
                if (subtaskAssignments.length > 0) {
                  console.log(`${subtaskAssignments.length} atama isteği gönderiliyor...`);
                  
                  // Tüm atamaları Promise.all ile asenkron olarak gönderelim
                  const assignmentResults = await Promise.all(
                    subtaskAssignments.map(async (assignment) => {
                      try {
                        console.log("API'ye gönderilecek atama verisi:", assignment);
                        
                        const assignmentResponse = await fetch(`${API_KEY}/SubtaskAssignment/create_subtask_assignment`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(assignment),
                        });
                        
                        if (!assignmentResponse.ok) {
                          const errorData = await assignmentResponse.json().catch(() => ({}));
                          console.error(`Alt görev ataması yapılırken hata (Subtask ID: ${assignment.subtask_id}):`, errorData);
                          return { success: false, error: errorData, assignment };
                        }
                        
                        const assignmentResult = await assignmentResponse.json();
                        console.log(`Alt görev ataması başarılı (Subtask ID: ${assignment.subtask_id}):`, assignmentResult);
                        return { success: true, data: assignmentResult, assignment };
                      } catch (error) {
                        console.error(`Alt görev ataması yapılırken hata (Subtask ID: ${assignment.subtask_id}):`, error);
                        return { success: false, error: error.message, assignment };
                      }
                    })
                  );
                  
                  console.log(`Atama sonuçları:`, assignmentResults);
                } else {
                  console.log(`Atanacak alt görev bulunamadı.`);
                }
              } else {
                console.log(`Alt görev ID'leri API yanıtında bulunamadı veya uygun formatta değil:`, responseData);
              }
            }
          } catch (error) {
            console.error(`Alt görevler eklenirken hata:`, error);
          }
        } else {
          console.log("Eklenecek alt görev bulunamadı.");
        }
      }

      toast.success("Proje, görevler ve alt görevler başarıyla oluşturuldu!")
      
        // Formu sıfırla
        setFormData({
          projectName: "",
          description: "",
          client: "",
          startDate: "",
          deadline: "",
          budget: "",
          priority: "orta",
          projectType: "web",
          teamMembers: [],
          broker: "",
        })
      
        setSelectedTeamMembers([])
        setSelectedBroker(null)
      setTasks([])

    } catch (error) {
      console.error("Hata:", error)
      toast.error(error.message || "Proje oluşturulurken bir hata oluştu.")
    } finally {
      setIsLoading(false)
    }
  }

  // Öncelik renklerini ve metinlerini belirle
  const getPriorityDetails = (priority) => {
    switch (priority) {
      case "düşük":
        return { color: "bg-gray-100 text-gray-800", text: "Düşük" }
      case "orta":
        return { color: "bg-blue-100 text-blue-800", text: "Orta" }
      case "yüksek":
        return { color: "bg-orange-100 text-orange-800", text: "Yüksek" }
      case "kritik":
        return { color: "bg-red-100 text-red-800", text: "Kritik" }
      default:
        return { color: "bg-gray-100 text-gray-800", text: "Belirsiz" }
    }
  }

  const priorityDetails = getPriorityDetails(formData.priority)

  return (
    <div className="p-6 overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Yeni Proje Oluştur</h3>
        <p className="text-gray-600">Yeni bir proje oluşturmak için aşağıdaki formu doldurun.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Taraf - Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Temel Bilgiler */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-gray-700" />
                    Proje Bilgileri
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                        Proje Adı <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="projectName"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        className={`w-full p-2.5 border ${errors.projectName ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Proje adını girin"
                      />
                      {errors.projectName && <p className="mt-1 text-sm text-red-500">{errors.projectName}</p>}
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Proje Açıklaması <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className={`w-full p-2.5 border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Proje detaylarını girin"
                      ></textarea>
                      {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Müşteri <span className="text-red-500">*</span>
                        </label>
                        <div className="relative" ref={clientSearchRef}>
                          <div className="relative">
                            <input
                              type="text"
                              value={clientSearchTerm}
                              onChange={(e) => setClientSearchTerm(e.target.value)}
                              onFocus={() => setShowClientResults(true)}
                              className={`w-full p-2.5 pl-10 border ${errors.client ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                              placeholder="Müşteri adını girin"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                          </div>

                          {showClientResults && clientSearchTerm && filteredClients.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {filteredClients.map((client) => (
                                <div
                                  key={client.id}
                                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, client: client.name }))
                                    setClientSearchTerm(client.name)
                                    setShowClientResults(false)
                                  }}
                                >
                                  <div className="flex items-center">
                                    <img
                                      src={client.avatar || "/placeholder.svg"}
                                      alt={client.name}
                                      className="w-8 h-8 rounded-full mr-2"
                                    />
                                    <div>
                                      <div className="font-medium">{client.name}</div>
                                      <div className="text-xs text-gray-500">{client.company}</div>
                                    </div>
                                  </div>
                                  <button type="button" className="text-blue-600 hover:text-blue-800 text-sm">
                                    Seç
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {errors.client && <p className="mt-1 text-sm text-red-500">{errors.client}</p>}
                      </div>

                      <div>
                        <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-1">
                          Proje Tipi
                        </label>
                        <select
                          id="projectType"
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="web">Web Geliştirme</option>
                          <option value="mobile">Mobil Uygulama</option>
                          <option value="design">Tasarım</option>
                          <option value="marketing">Pazarlama</option>
                          <option value="consulting">Danışmanlık</option>
                          <option value="other">Diğer</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Zaman ve Bütçe */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-700" />
                    Zaman ve Bütçe
                  </h4>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Başlangıç Tarihi <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          className={`w-full p-2.5 border ${errors.startDate ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
                      </div>

                      <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                          Bitiş Tarihi <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          id="deadline"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleChange}
                          className={`w-full p-2.5 border ${errors.deadline ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.deadline && <p className="mt-1 text-sm text-red-500">{errors.deadline}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                          Bütçe (₺) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className={`w-full p-2.5 border ${errors.budget ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Proje bütçesini girin"
                        />
                        {errors.budget && <p className="mt-1 text-sm text-red-500">{errors.budget}</p>}
                      </div>

                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                          Öncelik
                        </label>
                        <select
                          id="priority"
                          name="priority"
                          value={formData.priority}
                          onChange={handleChange}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="düşük">Düşük</option>
                          <option value="orta">Orta</option>
                          <option value="yüksek">Yüksek</option>
                          <option value="kritik">Kritik</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ekip Üyeleri */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-gray-700" />
                    Ekip Üyeleri
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ekip Üyesi Ekle</label>
                      <div className="relative" ref={teamSearchRef}>
                        <div className="relative">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setShowTeamResults(true)}
                            className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ekip üyesi ara..."
                          />
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        </div>

                        {showTeamResults && searchTerm && filteredTeamMembers.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredTeamMembers.map((member) => (
                              <div
                                key={member.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                                onClick={() => handleTeamMemberSelect(member)}
                              >
                                <div className="flex items-center">
                                  <img
                                    src={member.avatar || "/placeholder.svg"}
                                    alt={member.name}
                                    className="w-8 h-8 rounded-full mr-2"
                                  />
                                  <div>
                                    <div className="font-medium">{member.name}</div>
                                    <div className="text-xs text-gray-500">{member.role}</div>
                                  </div>
                                </div>
                                <button type="button" className="text-blue-600 hover:text-blue-800 text-sm">
                                  Ekle
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Seçilen Ekip Üyeleri</h5>
                      {selectedTeamMembers.length === 0 ? (
                        <p className="text-gray-500 text-sm">Henüz ekip üyesi seçilmedi</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedTeamMembers.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                            >
                              <div className="flex items-center">
                                <img
                                  src={member.avatar || "/placeholder.svg"}
                                  alt={member.name}
                                  className="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                  <div className="font-medium">{member.name}</div>
                                  <div className="text-xs text-gray-500">{member.role}</div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleTeamMemberRemove(member.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Komisyoncu */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-gray-700" />
                    Komisyoncu
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Komisyoncu Ekle</label>
                      <div className="relative" ref={brokerSearchRef}>
                        <div className="relative">
                          <input
                            type="text"
                            value={brokerSearchTerm}
                            onChange={(e) => setBrokerSearchTerm(e.target.value)}
                            onFocus={() => setShowBrokerResults(true)}
                            className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Komisyoncu ara..."
                          />
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        </div>

                        {showBrokerResults && brokerSearchTerm && filteredBrokers.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredBrokers.map((broker) => (
                              <div
                                key={broker.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                                onClick={() => handleBrokerSelect(broker)}
                              >
                                <div className="flex items-center">
                                  <img
                                    src={broker.avatar || "/placeholder.svg"}
                                    alt={broker.name}
                                    className="w-8 h-8 rounded-full mr-2"
                                  />
                                  <div>
                                    <div className="font-medium">{broker.name}</div>
                                    <div className="text-xs text-gray-500">{broker.company}</div>
                                  </div>
                                </div>
                                <button type="button" className="text-blue-600 hover:text-blue-800 text-sm">
                                  Ekle
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Seçilen Komisyoncu</h5>
                      {selectedBroker === null ? (
                        <p className="text-gray-500 text-sm">Henüz komisyoncu seçilmedi</p>
                      ) : (
                        <div className="space-y-2">
                          <div
                            key={selectedBroker.id}
                            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center">
                              <img
                                src={selectedBroker.avatar || "/placeholder.svg"}
                                alt={selectedBroker.name}
                                className="w-10 h-10 rounded-full mr-3"
                              />
                              <div>
                                <div className="font-medium">{selectedBroker.name}</div>
                                <div className="text-xs text-gray-500">{selectedBroker.company}</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleBrokerRemove()}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Görevler */}
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-gray-700" />
                    Görevler
                  </h4>

                  <div className="space-y-4">
                    {/* Yeni görev ekleme */}
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                      <h5 className="text-md font-medium text-gray-800 mb-4">Yeni Görev Ekle</h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-1">
                            Görev Adı <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="taskName"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Görev adını girin"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1">
                            Görev Açıklaması <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="taskDescription"
                            value={newTaskDescription}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Görev açıklaması girin"
                            rows="1"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="taskDifficulty" className="block text-sm font-medium text-gray-700 mb-1">
                          Zorluk Seviyesi
                        </label>
                        <select
                          id="taskDifficulty"
                          value={newTaskDifficulty}
                          onChange={(e) => setNewTaskDifficulty(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="kolay" className="text-green-600">⚪ Kolay</option>
                          <option value="orta" className="text-blue-600">⚫ Orta</option>
                          <option value="zor" className="text-orange-600">🔴 Zor</option>
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                        <div>
                          <label htmlFor="taskStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Başlangıç Tarihi <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            id="taskStartDate"
                            value={newTaskStartDate}
                            onChange={(e) => setNewTaskStartDate(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="taskEndDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Bitiş Tarihi <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            id="taskEndDate"
                            value={newTaskEndDate}
                            onChange={(e) => setNewTaskEndDate(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="flex items-center justify-between">
                          <h6 className="text-sm font-medium text-gray-700 mb-3">Alt Görevler</h6>
                          <span className="text-xs text-gray-500">Tüm alanlar zorunludur</span>
                        </div>
                        
                        {/* Alt görevler */}
                        <div className="ml-4 space-y-4 mb-3">
                          {newSubtasks.map((subtask, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
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
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Alt Görev Adı <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={subtask.name}
                                    onChange={(e) => handleSubtaskChange(index, 'name', e.target.value)}
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
                                      // String değerini sayıya çevirip kullanıcıyı bulalım
                                      const userId = parseInt(e.target.value);
                                      console.log("Seçilen kullanıcı ID:", userId); // Debug için log
                                      const selected = users.find(user => user.id === userId);
                                      console.log("Bulunan kullanıcı:", selected); // Debug için log
                                      handleSubtaskChange(index, 'assignee', selected || null);
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="">Görevli Seç</option>
                                    {users.map(user => (
                                      <option key={user.id} value={user.id}>{user.name}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              
                              <div className="mb-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Açıklama <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                  value={subtask.description}
                                  onChange={(e) => handleSubtaskChange(index, 'description', e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Alt görev açıklaması"
                                  rows="1"
                                />
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Başlangıç Tarihi <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="date"
                                    value={subtask.startDate}
                                    onChange={(e) => handleSubtaskChange(index, 'startDate', e.target.value)}
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
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Zorluk
                                  </label>
                                  <div className="relative">
                                    <select
                                      value={subtask.difficulty}
                                      onChange={(e) => handleSubtaskChange(index, 'difficulty', e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                      <option value="kolay">Kolay</option>
                                      <option value="orta">Orta</option>
                                      <option value="zor">Zor</option>
                                    </select>
                                    <div className="mt-1 w-full h-1 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full ${
                                          subtask.difficulty === "kolay" ? "bg-green-500" : 
                                          subtask.difficulty === "orta" ? "bg-blue-500" : 
                                          "bg-orange-500"
                                        }`}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <button
                          type="button"
                          onClick={handleAddSubtask}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        >
                          + Alt Görev Ekle
                        </button>
                      </div>
                      
                      <div className="text-sm text-gray-500 mt-2 mb-4">
                        <p>* işaretli alanlar zorunludur. Görevler ve alt görevler için tüm bilgileri eksiksiz girmelisiniz.</p>
                      </div>
                      
                      <div className="mt-5 pt-4 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={handleAddTask}
                          disabled={!newTaskName.trim()}
                          className={`w-full py-2.5 rounded-lg ${
                            newTaskName.trim()
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          Görevi Ekle
                        </button>
                      </div>
                    </div>
                    
                    {/* Eklenen görevlerin listesi */}
                    {tasks.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Eklenen Görevler</h5>
                        
                        <div className="space-y-3">
                          {tasks.map((task, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center mb-1">
                                    <span className="font-medium text-gray-900">{task.name}</span>
                                    <span className={`ml-2 px-3 py-1 rounded-lg text-sm font-medium ${getDifficultyDetails(task.difficulty).color}`}>
                                      {getDifficultyDetails(task.difficulty).text} Zorluk
                                    </span>
                                  </div>
                                  
                                  {task.description && (
                                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                  )}
                                  
                                  {task.subtasks.length > 0 && (
                                    <div className="ml-4 mt-3 space-y-2">
                                      <h6 className="text-xs font-medium text-gray-700 mb-1">Alt Görevler</h6>
                                      {task.subtasks.map((subtask, subtaskIndex) => (
                                        <div key={subtaskIndex} className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                                          <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                              <div className="flex items-center mb-1">
                                                <span className="font-medium text-sm">{subtask.name}</span>
                                                {subtask.difficulty && (
                                                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    subtask.difficulty === "kolay" ? "bg-green-100 text-green-800" : 
                                                    subtask.difficulty === "orta" ? "bg-blue-100 text-blue-800" : 
                                                    "bg-orange-100 text-orange-800"
                                                  }`}>
                                                    {subtask.difficulty === "kolay" ? "Kolay" : 
                                                     subtask.difficulty === "orta" ? "Orta" : "Zor"}
                                                  </span>
                                                )}
                                              </div>
                                              
                                              {subtask.description && (
                                                <p className="text-xs text-gray-600 mb-1">{subtask.description}</p>
                                              )}
                                              
                                              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                                {subtask.assignee && (
                                                  <div className="flex items-center">
                                                    <img
                                                      src={subtask.assignee.avatar || "/placeholder.svg"}
                                                      alt={subtask.assignee.name}
                                                      className="w-3 h-3 rounded-full mr-1"
                                                    />
                                                    <span>{subtask.assignee.name}</span>
                                                  </div>
                                                )}
                                                
                                                {subtask.startDate && (
                                                  <div className="flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    <span>Başlangıç: {subtask.startDate}</span>
                                                  </div>
                                                )}
                                                
                                                {subtask.endDate && (
                                                  <div className="flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    <span>Bitiş: {subtask.endDate}</span>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTask(index)}
                                  className="text-red-600 hover:text-red-800 ml-2"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">{/* Buton buradan kaldırıldı */}</div>
            </form>
          </div>
        </div>

        {/* Sağ Taraf - Önizleme */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm sticky top-6">
            <div className="p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Proje Önizleme</h4>

              <div className="space-y-6">
                {/* Proje Adı ve Açıklama */}
                <div>
                  <h5 className="text-xl font-bold text-gray-900 mb-2">{formData.projectName || "Proje Adı"}</h5>
                  <p className="text-gray-600 mb-4">{formData.description || "Proje açıklaması burada görünecek."}</p>

                  {/* Öncelik */}
                  <div className="flex items-center mb-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityDetails.color}`}>
                      {priorityDetails.text}
                    </span>
                    <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {formData.projectType === "web"
                        ? "Web Geliştirme"
                        : formData.projectType === "mobile"
                          ? "Mobil Uygulama"
                          : formData.projectType === "design"
                            ? "Tasarım"
                            : formData.projectType === "marketing"
                              ? "Pazarlama"
                              : formData.projectType === "consulting"
                                ? "Danışmanlık"
                                : "Diğer"}
                    </span>
                  </div>
                </div>

                {/* Müşteri ve Tarihler */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Briefcase className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-sm">
                      Müşteri: <span className="font-medium">{formData.client || "Belirtilmedi"}</span>
                    </span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-sm">
                      Başlangıç: <span className="font-medium">{formData.startDate || "Belirtilmedi"}</span>
                    </span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-sm">
                      Bitiş: <span className="font-medium">{formData.deadline || "Belirtilmedi"}</span>
                    </span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-sm">
                      Bütçe:{" "}
                      <span className="font-medium">
                        {formData.budget ? `${Number(formData.budget).toLocaleString("tr-TR")} ₺` : "Belirtilmedi"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Ekip */}
                <div>
                  <div className="flex items-center text-gray-700 mb-2">
                    <Users className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">Ekip Üyeleri ({selectedTeamMembers.length})</span>
                  </div>

                  {selectedTeamMembers.length === 0 ? (
                    <p className="text-gray-500 text-sm">Henüz ekip üyesi seçilmedi</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedTeamMembers.map((member) => (
                        <div key={member.id} className="flex items-center">
                          <img
                            src={member.avatar || "/placeholder.svg"}
                            alt={member.name}
                            className="w-8 h-8 rounded-full border-2 border-white"
                            title={`${member.name} - ${member.role}`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Komisyoncu */}
                <div>
                  <div className="flex items-center text-gray-700 mb-2">
                    <Briefcase className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">Komisyoncu</span>
                  </div>

                  {!selectedBroker ? (
                    <p className="text-gray-500 text-sm">Henüz komisyoncu seçilmedi</p>
                  ) : (
                    <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                      <img
                        src={selectedBroker.avatar || "/placeholder.svg"}
                        alt={selectedBroker.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <div className="text-sm font-medium">{selectedBroker.name}</div>
                        <div className="text-xs text-gray-500">{selectedBroker.company}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Görevler Önizleme */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-gray-700 mb-3">
                    <CheckCircle className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">Görevler ({tasks.length})</span>
                  </div>

                  {tasks.length === 0 ? (
                    <p className="text-gray-500 text-sm">Henüz görev eklenmedi</p>
                  ) : (
                    <div className="space-y-3">
                      {tasks.map((task, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="flex items-start">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <span className="font-medium text-sm">{task.name}</span>
                                <span className={`ml-2 px-3 py-1 rounded-lg text-sm font-medium ${getDifficultyDetails(task.difficulty).color}`}>
                                  {getDifficultyDetails(task.difficulty).text} Zorluk
                                </span>
                              </div>
                              
                              {task.description && (
                                <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                              )}
                              
                              {task.subtasks.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {task.subtasks.map((subtask, subtaskIndex) => (
                                    <div key={subtaskIndex} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                                      <div className="flex items-center">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                                        <span>{subtask.name}</span>
                                      </div>
                                      {subtask.assignee && (
                                        <div className="flex items-center ml-2">
                                          <img
                                            src={subtask.assignee.avatar || "/placeholder.svg"}
                                            alt={subtask.assignee.name}
                                            className="w-4 h-4 rounded-full mr-1"
                                          />
                                          <span className="text-xs text-gray-500">{subtask.assignee.name}</span>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Kontrol Listesi */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Kontrol Listesi</h5>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle
                        className={`w-4 h-4 mr-2 ${formData.projectName ? "text-green-500" : "text-gray-300"}`}
                      />
                      <span className={`text-sm ${formData.projectName ? "text-gray-700" : "text-gray-400"}`}>
                        Proje adı
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle
                        className={`w-4 h-4 mr-2 ${formData.description ? "text-green-500" : "text-gray-300"}`}
                      />
                      <span className={`text-sm ${formData.description ? "text-gray-700" : "text-gray-400"}`}>
                        Proje açıklaması
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${formData.client ? "text-green-500" : "text-gray-300"}`} />
                      <span className={`text-sm ${formData.client ? "text-gray-700" : "text-gray-400"}`}>
                        Müşteri bilgisi
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle
                        className={`w-4 h-4 mr-2 ${formData.startDate && formData.deadline ? "text-green-500" : "text-gray-300"}`}
                      />
                      <span
                        className={`text-sm ${formData.startDate && formData.deadline ? "text-gray-700" : "text-gray-400"}`}
                      >
                        Proje tarihleri
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${formData.budget ? "text-green-500" : "text-gray-300"}`} />
                      <span className={`text-sm ${formData.budget ? "text-gray-700" : "text-gray-400"}`}>
                        Bütçe bilgisi
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle
                        className={`w-4 h-4 mr-2 ${selectedTeamMembers.length > 0 ? "text-green-500" : "text-gray-300"}`}
                      />
                      <span className={`text-sm ${selectedTeamMembers.length > 0 ? "text-gray-700" : "text-gray-400"}`}>
                        Ekip üyeleri
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${selectedBroker ? "text-green-500" : "text-gray-300"}`} />
                      <span className={`text-sm ${selectedBroker ? "text-gray-700" : "text-gray-400"}`}>
                        Komisyoncu
                      </span>
                    </li>
                  </ul>

                  {/* Buton kontrol listesinin altına eklendi */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || !isFormComplete()}
                    className={`w-full mt-6 px-6 py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
                      isFormComplete()
                        ? "bg-black text-white hover:bg-gray-800"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? "Oluşturuluyor..." : "Proje Oluştur"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDate, setTaskDate] = useState(new Date());
  const [taskPriority, setTaskPriority] = useState("");
  const [selectedClient, setSelectedClient] = useState("CONTRACS-DF");
  const [selectedCategory, setSelectedCategory] = useState("IMAGEM");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const addTask = () => {
    if (taskTitle && taskPriority && taskDate) {
      const newTask = {
        id: Date.now().toString(),
        title: taskTitle,
        deadline: taskDate,
        priority: taskPriority,
        client: selectedClient,
        category: selectedCategory,
        completed: false,
      };

      setTasks((prevTasks) =>
        [...prevTasks, newTask].sort((a, b) => a.deadline - b.deadline)
      );

      setTaskTitle("");
      setTaskDate(new Date());
      setTaskPriority("");
    } else {
      alert("Preencha todos os campos obrigatórios!");
    }
  };

  const renderTask = ({ item }) => (
    <View
      style={[
        styles.taskItem,
        item.priority === "ALTA"
          ? styles.highPriority
          : item.priority === "MÉDIA"
          ? styles.mediumPriority
          : styles.lowPriority,
      ]}
    >
      <Text style={styles.taskTitle}>
        {item.title}
      </Text>
      <Text>{`Prazo: ${item.deadline.toLocaleString()}`}</Text>
      <Text>{`Prioridade: ${item.priority}`}</Text>
      <Text>{`Cliente: ${item.client}`}</Text>
      <Text>{`Categoria: ${item.category}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gerenciador de Tarefas</Text>
      <TextInput
        style={styles.input}
        placeholder="Título da Tarefa"
        value={taskTitle}
        onChangeText={setTaskTitle}
      />
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{`Data: ${taskDate.toLocaleDateString()}`}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowTimePicker(true)}
      >
        <Text>{`Hora: ${taskDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={taskDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setTaskDate(selectedDate);
          }}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={taskDate}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              const updatedDate = new Date(taskDate);
              updatedDate.setHours(selectedTime.getHours());
              updatedDate.setMinutes(selectedTime.getMinutes());
              setTaskDate(updatedDate);
            }
          }}
        />
      )}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowClientModal(true)}
      >
        <Text>{`Cliente: ${selectedClient}`}</Text>
      </TouchableOpacity>
      <Modal visible={showClientModal} animationType="slide">
        <View style={styles.modal}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowClientModal(false)}
          >
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
          {["CONTRACS-DF", "FENAJUFE", "SAAE", "SINDCOM"].map((client) => (
            <TouchableOpacity
              key={client}
              onPress={() => {
                setSelectedClient(client);
                setShowClientModal(false);
              }}
            >
              <Text style={styles.modalItem}>{client}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowCategoryModal(true)}
      >
        <Text>{`Categoria: ${selectedCategory}`}</Text>
      </TouchableOpacity>
      <Modal visible={showCategoryModal} animationType="slide">
        <View style={styles.modal}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowCategoryModal(false)}
          >
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
          {["IMAGEM", "VÍDEO", "ÁUDIO", "TEXTO"].map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => {
                setSelectedCategory(category);
                setShowCategoryModal(false);
              }}
            >
              <Text style={styles.modalItem}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
      <View style={styles.priorityContainer}>
        <Text style={styles.label}>Prioridade:</Text>
        {["ALTA", "MÉDIA", "BAIXA"].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.priorityButton,
              taskPriority === level && styles.selectedPriority,
              level === "ALTA"
                ? styles.highPriority
                : level === "MÉDIA"
                ? styles.mediumPriority
                : styles.lowPriority,
            ]}
            onPress={() => setTaskPriority(level)}
          >
            <Text style={styles.priorityText}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ marginBottom: 20 }}>
        <Button title="Adicionar Tarefa" onPress={addTask} />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  priorityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  priorityButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  selectedPriority: {
    borderWidth: 2,
    borderColor: "black",
  },
  priorityText: {
    fontWeight: "bold",
  },
  highPriority: {
    backgroundColor: "#f8d7da",
  },
  mediumPriority: {
    backgroundColor: "#fff3cd",
  },
  lowPriority: {
    backgroundColor: "#d4edda",
  },
  taskItem: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
  },
  completed: {
    textDecorationLine: "line-through",
    color: "green",
  },
  pending: {
    color: "black",
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
  modalItem: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "80%",
    textAlign: "center",
  },
  
  taskTitle: {
    fontSize: 16, // Altere este valor para aumentar a fonte
    fontWeight: "bold", // Já está em negrito (bold), mas você pode ajustar se quiser
  },

});

export default App;

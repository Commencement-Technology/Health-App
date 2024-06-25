import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { HeaderConsulta } from "@/components/Consulta/HeaderConsulta/Header";
import { DicaAgendamento } from "../components/Consulta/ComponenteDicaAgendamento/DicaAgendamento";
import Especialidade from "@/components/Consulta/DropDownEspecialidade/Especialidade";
import Medico from "@/components/Consulta/DropDownMedico/Medico";
import CalendarioConsulta from "../components/Consulta/CalendarioConsulta/CalendarioConsulta";
import HorarioConsulta from "../components/Consulta/HorarioConsulta/HorarioConsulta";
import SelecaoDependente from "@/components/Consulta/SelecaoDependenteConsulta/SelecaoDependente";
import ConfirmacaoConsulta from "@/components/Consulta/ConfirmacaoConsulta/ConfirmacaoConsulta";
import {
  buscarAderente,
  buscarDependentes,
  buscarMedicosEspecialidade,
  buscarEspecialidades,
  buscarDiasAtendimentoMedico,
} from "@/utils/requestConfig";
import { styles } from "../styles/StylesServicosPage/StylesConsultaPage/styles";
import { salvarConsulta } from "@/connection/salvarConsulta";
import ModalCarregamento from "@/components/constants/ModalCarregamento";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UnidadeAtendimento from "@/components/Consulta/DropDownUnidadeAtendimento/DropDownUnidadeAtendimento";

interface Consulta {
  usuario: string;
  dependente: string;
  unidadeAtendimento: string;
  medico: string;
  especialidade: string;
  data: string;
  horario: string;
  telefoneContato: string;
}

export default function Consulta() {
  const [usuario, setUsuario] = useState<any | null>(null);
  const [cpfUsuario, setCpfUsuario] = useState<string | null>(null);
  const [unidadeAtendimentoId, setUnidadeAtendimentoId] = useState<string | null>(null);
  const [unidadeAtendimentoNome, setUnidadeAtendimentoNome] = useState<string | null>(null);
  const [especialidadeId, setEspecialidadeId] = useState<string | null>(null);
  const [especialidadeNome, setEspecialidadeNome] = useState<string | null>(null);
  const [medicoSelecionado, setMedicoSelecionado] = useState<any | null>(null);
  const [diasDisponiveis, setDiasDisponiveis] = useState<any[]>([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [calendarioVisivel, setCalendarioVisivel] = useState(false);
  const [horarioVisivel, setHorarioVisivel] = useState(false);
  const [selectDependenteVisivel, setSelectDependenteVisivel] = useState(false);
  const [confirmacaoVisivel, setConfirmacaoVisivel] = useState(false);
  const [dataConsulta, setDataConsulta] = useState<string | null>(null);
  const [horarioConsulta, setHorarioConsulta] = useState<string | null>(null);
  const [isDependente, setIsDependente] = useState(false);
  const [dependenteSelecionado, setDependenteSelecionado] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dependentes, setDependentes] = useState<any[]>([]);
  const [unidadeAtendimentoSelecionado, setUnidadeAtendimentoSelecionado] = useState<string | null>(null);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<string | null>(null);

  const [consulta, setConsulta] = useState({
    usuario: "",
    dependente: "",
    unidadeAtendimento: "",
    medico: "",
    especialidade: "",
    data: "",
    horario: "",
    telefoneContato: "(34) 99931-7302",
  });

  useEffect(() => {
    const fetchUsuarioLogado = async () => {
      try {
        setLoading(true);
        const cpfDoBanco = await AsyncStorage.getItem("userCpf");
        if (cpfDoBanco) {
          setCpfUsuario(cpfDoBanco);

          console.log("Buscando usuário com CPF:", cpfDoBanco);

          const response = await buscarAderente(cpfDoBanco, true);
          const usuarioLogado = response.data;

          console.log("Dados do usuário:", usuarioLogado);
          setUsuario(usuarioLogado);
          setConsulta((prev) => ({
            ...prev,
            usuario: usuarioLogado.nome,
          }));

          if (usuarioLogado && usuarioLogado.idAderente) {
            const dependentesResponse = await buscarDependentes(usuarioLogado.idAderente);
            setDependentes(dependentesResponse.data);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar usuário logado:", error);
        Alert.alert("Erro", "Usuário não encontrado");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarioLogado();
  }, []);

  const handleMedicoSelect = async (medico: any) => {
    setMedicoSelecionado(medico);
    setCalendarioVisivel(true);
    try {
      setLoading(true);
      const response = await buscarDiasAtendimentoMedico(medico.value, new Date().getMonth() + 1, new Date().getFullYear());
      console.log("Dias de Atendimento ao selecionar médico: ", response.data);
      setDiasDisponiveis(response.data);
    } catch (error) {
      console.error("Erro ao buscar dias de atendimento ao selecionar médico:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: string) => {
    console.log("Data Selecionada: ", date);

    const diaSelecionado = diasDisponiveis.find((dia: any) => dia.data.split("T")[0] === date);

    if (diaSelecionado) {
      console.log("Dia da Semana Selecionado: ", diaSelecionado.dia);
      console.log("Horários Disponíveis: ", diaSelecionado.horarios.map((horario: any) => horario.horario));
    } else {
      console.log("Nenhum dia de atendimento encontrado para a data selecionada.");
    }

    if (diaSelecionado && diaSelecionado.horarios.length > 0) {
      setHorariosDisponiveis(diaSelecionado.horarios.map((horario: any) => horario.horario));
      setDataConsulta(date);
      setConsulta((prev) => ({
        ...prev,
        data: date || "",
      }));
      setHorarioVisivel(true);
    } else {
      console.error(`Horários de atendimento não definidos para a data ${date}.`);
      Alert.alert("Horários de atendimento não definidos para a data selecionada.");
    }
  };
  
  const handleTimeSelect = (time: string) => {
    setHorarioConsulta(time);
    setConsulta((prev) => ({
      ...prev,
      horario: time || "",
    }));
    setConfirmacaoVisivel(true);
  };

  const handleConfirmDependente = () => {
    if (isDependente && dependenteSelecionado) {
      setConsulta((prev) => ({
        ...prev,
        dependente: dependenteSelecionado || "",
        usuario: usuario.nome || "",
      }));
    } else {
      setConsulta((prev) => ({
        ...prev,
        dependente: "null",
        usuario: usuario.nome || "",
      }));
    }
    setSelectDependenteVisivel(false);
  };

  const handleConfirm = () => {
    const consultaJSON = JSON.stringify(consulta, null, 2);
    console.log("Consulta confirmada:", consultaJSON);
    Alert.alert("Consulta confirmada!", consultaJSON);
    setConfirmacaoVisivel(false);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsDependente(checked);
    if (checked) {
      setSelectDependenteVisivel(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View>
        <HeaderConsulta />
        <DicaAgendamento />

        <UnidadeAtendimento
          UnidadeAtendimentoCarregada={(id, nome) => {
            setUnidadeAtendimentoId(id);
            setUnidadeAtendimentoNome(nome);
            setConsulta((prev) => ({
              ...prev,
              unidadeAtendimento: nome || "",
            }));
          }}
          unidadeAtendimentoSelecionada={unidadeAtendimentoSelecionado}
        />

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={isDependente ? "checked" : "unchecked"}
            onPress={() => handleCheckboxChange(!isDependente)}
          />
          <Text style={styles.label}>Para um dependente?</Text>
        </View>

        {unidadeAtendimentoId && (
          <Especialidade
            EspecialidadeCarregada={(id, nome) => {
              setEspecialidadeId(id);
              setEspecialidadeNome(nome);
              setConsulta((prev) => ({
                ...prev,
                especialidade: nome || "",
              }));
            }}
            especialidadeSelecionada={especialidadeSelecionada}
          />
        )}

        {especialidadeId && (
          <Medico
            especialidadeId={especialidadeId}
            unidadeAtendimentoId={unidadeAtendimentoId}
            medicoSelecionado={medicoSelecionado ? medicoSelecionado.id : null}
            onMedicoSelect={handleMedicoSelect}
          />
        )}
        <ModalCarregamento visivel={loading} />

        <SelecaoDependente
          visivel={selectDependenteVisivel}
          onClose={() => setSelectDependenteVisivel(false)}
          onConfirm={handleConfirmDependente}
          isDependente={isDependente}
          setIsDependente={setIsDependente}
          dependentes={dependentes}
          selectedDependente={dependenteSelecionado}
          setSelectedDependente={setDependenteSelecionado}
        />

        {medicoSelecionado && (
          <CalendarioConsulta
            visivel={calendarioVisivel}
            onClose={() => setCalendarioVisivel(false)}
            onDateSelect={handleDateSelect}
            medicoId={medicoSelecionado.key}
          />
        )}

        <HorarioConsulta
          visivel={horarioVisivel}
          onClose={() => setHorarioVisivel(false)}
          onTimeSelect={handleTimeSelect}
          horariosDisponiveis={horariosDisponiveis}
        />

        {confirmacaoVisivel && consulta && (
          <ConfirmacaoConsulta
            visivel={confirmacaoVisivel}
            onClose={() => setConfirmacaoVisivel(false)}
            onConfirm={handleConfirm}
            consulta={consulta}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
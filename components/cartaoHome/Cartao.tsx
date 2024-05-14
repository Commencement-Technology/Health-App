import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { styles } from "./styles";

export function Cartao() {
  return (
    <>
      <TouchableOpacity>
        <LinearGradient
          colors={["#025940", "#8CBF1F"]}
          start={{ x: 0, y: 1}}
          end={{ x: 1.3, y: 0.5}}
          style={[styles.containerCard]}
        >
          <View style={[styles.componenteCard]}>
            <Text style={[styles.nomeCartao]}>MARIA APARECIDA SOUZA SILVA</Text>
            <Text style={[styles.descricaoNome]}>Nome do Beneficiário</Text>

            <Text style={[styles.dataNascimentoCartao]}>19/04/1965</Text>
            <Text style={[styles.descricaoDataNascimento]}>
              Data de Nascimento
            </Text>

            <View style={[styles.containerStatusPessoa]}>
              <Text style={[styles.descricaoStatusPessoa]}>STATUS:</Text>
              <View style={[styles.containerStatus]}>
                <Text style={[styles.textoStatus]}>ATIVADO</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );
}

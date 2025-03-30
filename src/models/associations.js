const { Movimento, Classe, TipoMov } = require('./index');

function setupAssociations() {
  // Associação Classe -> TipoMov
  Classe.belongsTo(TipoMov, { 
    foreignKey: "tipo_mov_id", 
    as: "tipoMov" 
  });
  
  // Associação TipoMov -> Classe
  TipoMov.hasMany(Classe, { 
    foreignKey: "tipo_mov_id", 
    as: "classes" 
  });

  // Associação Movimento -> Classe
  Movimento.belongsTo(Classe, { 
    foreignKey: "classe_id", 
    as: "classe" 
  });
  
  // Associação Classe -> Movimento
  Classe.hasMany(Movimento, { 
    foreignKey: "classe_id", 
    as: "movimentos" 
  });

  console.log('Associações configuradas com sucesso');
}

module.exports = setupAssociations;

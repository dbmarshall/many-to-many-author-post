module.exports = function(sequelize, DataTypes) {
  var Author = sequelize.define("Author", {
    name: DataTypes.STRING
  });

  Author.associate = (models) =>{
    Author.belongsToMany(models.Post, {
      through: {model: models.AuthorPost}
    })
  }
    // Author.associate = function(models) {
  //   // Associating Author with Posts
  //   // When an Author is deleted, also delete any associated Posts
  //   Author.hasMany(models.Post, {
  //     onDelete: "cascade"
  //   });
  // };

  return Author;
};

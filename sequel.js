const { Sequelize, DataTypes, Model } = require("sequelize");
//const sequelize = new Sequelize("sqlite::memory");
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite'
});
class User extends Model {}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, 
    modelName: "User", 
  }
);

class Book extends Model {}

Book.init(
  {
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, 
    modelName: "Book", 
  }
);

sequelize.sync({ force: true }).then(async() => {
    const me = await User.create({ email: "colin@macallister.net" })
    const jsbook = await Book.create({ title: "JavaScript for Fun and Profit" })
})


exports.book = Book;
exports.user = User;

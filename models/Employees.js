module.exports = function (sequelize, DataTypes) {
    var Employees = sequelize.define("Employees", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        }
    });

    Employees.associate = function (models) {

        Employees.hasMany(models.Shifts, {});

    };

    Employees.associate = function (models) {

        Employees.belongsTo(models.Users, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Employees;
    
};
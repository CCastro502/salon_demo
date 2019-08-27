module.exports = function (sequelize, DataTypes) {
    var Shifts = sequelize.define("Shifts", {
        dateStart: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        dateEnd : {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                len: [1]
            }
        }
    });

    Shifts.associate = function (models) {

        Shifts.belongsTo(models.Employees, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Shifts;
    
};
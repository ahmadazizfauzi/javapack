'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('site_visits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      visitor_token: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      visitor_type: {
        type: Sequelize.ENUM('new', 'returning'),
        allowNull: false,
        defaultValue: 'new'
      },
      page: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'home'
      },
      user_agent: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      visit_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('site_visits');
  }
};

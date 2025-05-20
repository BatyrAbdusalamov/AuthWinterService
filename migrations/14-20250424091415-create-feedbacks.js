'use strict';
/** @type {import('sequelize-cli').Migration} */
const SQL_QUERY_MIGRATE = `
CREATE TABLE public.feedbacks (
	id serial4 NOT NULL,
	client_id int4 NULL,
	rating int4 NOT NULL,
	"comment" text NULL,
	is_visible bool DEFAULT false NULL,
	created_at timestamp DEFAULT now() NULL,
	"name" varchar(400) NULL,
	CONSTRAINT feedbacks_pkey PRIMARY KEY (id),
	CONSTRAINT feedbacks_rating_check CHECK (((rating >= 1) AND (rating <= 5))),
	CONSTRAINT feedbacks_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id)
);
`

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(SQL_QUERY_MIGRATE);
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('feedbacks');
  }
};
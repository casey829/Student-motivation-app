"""Create user table with email verification fields

Revision ID: 4b18ab3710c9
Revises: 6662817002fb
Create Date: 2024-08-13 21:07:54.247950

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4b18ab3710c9'
down_revision = '6662817002fb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_verified', sa.Boolean(), nullable=True))
        batch_op.add_column(sa.Column('verification_token', sa.String(length=255), nullable=True))
        batch_op.create_unique_constraint(None, ['verification_token'])
        batch_op.drop_column('active')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('active', sa.BOOLEAN(), autoincrement=False, nullable=True))
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_column('verification_token')
        batch_op.drop_column('is_verified')

    # ### end Alembic commands ###
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'b699968fbc2f'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Drop foreign key constraints first
    op.drop_constraint('comments_user_id_fkey', 'comments', type_='foreignkey')
    op.drop_constraint('comments_video_id_fkey', 'comments', type_='foreignkey')
    op.drop_constraint('comments_audio_id_fkey', 'comments', type_='foreignkey')
    op.drop_constraint('comments_article_id_fkey', 'comments', type_='foreignkey')
    op.drop_constraint('comments_parent_id_fkey', 'comments', type_='foreignkey')
    
    op.drop_constraint('audios_user_id_fkey', 'audios', type_='foreignkey')
    op.drop_constraint('videos_user_id_fkey', 'videos', type_='foreignkey')
    op.drop_constraint('articles_user_id_fkey', 'articles', type_='foreignkey')
    op.drop_constraint('user_roles_user_id_fkey', 'user_roles', type_='foreignkey')
    op.drop_constraint('user_roles_role_id_fkey', 'user_roles', type_='foreignkey')
    
    # Drop tables in reverse order of dependencies
    op.drop_table('comments')
    op.drop_table('articles')
    op.drop_table('audios')
    op.drop_table('videos')
    op.drop_table('user_roles')
    op.drop_table('roles')
    op.drop_table('users')

    # Create tables
    op.create_table('users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('username', sa.String(255), nullable=False, unique=True),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('active', sa.Boolean, default=True),
        sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', postgresql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), onupdate=sa.text('CURRENT_TIMESTAMP'))
    )

    op.create_table('roles',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(80), nullable=False, unique=True)
    )

    op.create_table('user_roles',
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
        sa.Column('role_id', sa.Integer, sa.ForeignKey('roles.id'), primary_key=True)
    )

    op.create_table('videos',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('filename', sa.String(255), nullable=False),
        sa.Column('file_data', postgresql.BYTEA(), nullable=False),
        sa.Column('description', sa.Text),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('uploaded_at', postgresql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('approved', sa.Boolean, default=False),
        sa.Column('category', sa.String(255))
    )

    op.create_table('audios',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('filename', sa.String(255), nullable=False),
        sa.Column('file_data', postgresql.BYTEA(), nullable=False),
        sa.Column('description', sa.Text),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('uploaded_at', postgresql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('approved', sa.Boolean, default=False),
        sa.Column('category', sa.String(255))
    )

    op.create_table('articles',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('description', sa.Text),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('uploaded_at', postgresql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('approved', sa.Boolean, default=False),
        sa.Column('category', sa.String(255))
    )

    op.create_table('comments',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('video_id', sa.Integer, sa.ForeignKey('videos.id', ondelete='CASCADE')),
        sa.Column('audio_id', sa.Integer, sa.ForeignKey('audios.id', ondelete='CASCADE')),
        sa.Column('article_id', sa.Integer, sa.ForeignKey('articles.id', ondelete='CASCADE')),
        sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('parent_id', sa.Integer, sa.ForeignKey('comments.id', ondelete='CASCADE'))
    )

def downgrade():
    # Reverse the operations in `upgrade` function
    op.drop_table('comments')
    op.drop_table('articles')
    op.drop_table('audios')
    op.drop_table('videos')
    op.drop_table('user_roles')
    op.drop_table('roles')
    op.drop_table('users')

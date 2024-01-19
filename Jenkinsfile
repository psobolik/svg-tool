pipeline {
    agent any
    environment {
        TARGET_FOLDER = '/usr/local/www/svg-tool'
        DIST_FOLDER = './dist/svg-tool'
    }
    stages {
        stage('Setup') {
            steps {
                sh 'yarn install'
            }
        }
        stage('Build') {
            steps {
                sh 'yarn build'
            }
        }
        stage('Deploy') {
            steps {
                sh 'mkdir -p $TARGET_FOLDER'
                sh 'rm $TARGET_FOLDER/assets/*'
                sh 'rsync -a $DIST_FOLDER/* $TARGET_FOLDER'
            }
        }
        stage('Restart') {
            steps {
                sh 'sudo systemctl restart apache2'
            }
        }
    }
}
pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '30'))
    timeout(time: 90, unit: 'MINUTES')
  }

  triggers {
    cron('H 2 * * *')
  }

  environment {
    CI = 'true'
    BROWSER = 'chrome'
    HEADLESS = 'true'
    VIDEO_ENABLED = 'true'
    TRACE_ENABLED = 'true'
    SCREENSHOT_EACH_STEP = 'false'
    LOG_LEVEL = 'info'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        dir('Sika_FrameWork') {
          dir('reports') {
            deleteDir()
          }
          dir('logs') {
            deleteDir()
          }
          dir('allure-report') {
            deleteDir()
          }
        }
        script {
          def branchName = env.BRANCH_NAME ?: env.GIT_BRANCH ?: ''
          branchName = branchName.replaceFirst(/^origin\//, '').replaceFirst(/^\*\//, '')
          if (branchName != 'master') {
            error("This pipeline must be configured to check out master; found '${branchName ?: 'unknown'}'.")
          }

          def commitSha = isUnix()
            ? sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
            : bat(returnStdout: true, script: '@git rev-parse HEAD').trim()
          echo "Checked out branch ${branchName} at ${commitSha}"
        }
      }
    }

    stage('Environment Setup') {
      steps {
        dir('Sika_FrameWork') {
          script {
            if (isUnix()) {
              sh 'node --version'
              sh 'npm --version'
              sh 'node -e "const major = Number(process.versions.node.split(String.fromCharCode(46))[0]); if (![20, 22].includes(major) && major < 24) process.exit(1)"'
              sh 'java -version'
              sh 'npm ci'
              sh 'if [ "$(uname -s)" = "Linux" ]; then npx playwright install --with-deps chrome; else npx playwright install chrome; fi'
            } else {
              bat 'node --version'
              bat 'npm --version'
              bat 'node -e "const major = Number(process.versions.node.split(String.fromCharCode(46))[0]); if (![20, 22].includes(major) && major < 24) process.exit(1)"'
              bat 'java -version'
              bat 'npm ci'
              bat 'npx playwright install chrome'
            }
          }
        }
      }
    }

    stage('Framework Validation') {
      steps {
        dir('Sika_FrameWork') {
          script {
            if (isUnix()) {
              sh 'npx tsc --noEmit'
            } else {
              bat 'npx tsc --noEmit'
            }
          }
        }
      }
    }

    stage('Automated Test Execution') {
      steps {
        dir('Sika_FrameWork') {
          catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
            script {
              if (isUnix()) {
                sh 'npm test'
              } else {
                bat 'npm test'
              }
            }
          }
        }
      }
    }

    stage('Test Reporting') {
      steps {
        dir('Sika_FrameWork') {
          catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
            script {
              if (isUnix()) {
                sh 'npm run report:generate'
              } else {
                bat 'npm run report:generate'
              }
            }
          }
          catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
            script {
              if (isUnix()) {
                sh 'npm run allure:generate'
              } else {
                bat 'npm run allure:generate'
              }
            }
          }
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts(
        artifacts: 'Sika_FrameWork/reports/**,Sika_FrameWork/allure-report/**,Sika_FrameWork/logs/*.log',
        allowEmptyArchive: true,
        fingerprint: false
      )
    }
    success {
      echo "Nightly test execution succeeded. Build: ${env.BUILD_URL}"
    }
    failure {
      echo "Nightly test execution failed. Review the archived reports and logs. Build: ${env.BUILD_URL}"
    }
  }
}

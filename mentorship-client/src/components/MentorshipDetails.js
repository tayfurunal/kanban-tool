import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from './Layout/Header';
import axios from 'axios';

class SelectMentor extends Component {
  constructor() {
    super();

    this.state = {
      currentUser: '',
      mentorDisplayName: '',
      menteeDisplayName: '',
      mentorUsername: '',
      menteeUsername: '',
      status: '',
      startDate: '',
      numberOfPhases: 0,
      hasPhase: false,
      mentorThoughts: '',
      menteeThoughts: '',
      currentPhase: 0,
      isMentor: false,
      isMentee: false,
      phases: [],
    };
  }

  getMentorship = async (id) => {
    let application = await axios.get(
      `http://localhost:8080/api/mentorships/${id}`
    );
    this.setState({
      mentorDisplayName: application.data.mentor.user.displayName,
      mentorUsername: application.data.mentor.user.username,
      menteeDisplayName: application.data.mentee.user.displayName,
      menteeUsername: application.data.mentee.user.username,
      status: application.data.status,
      startDate: application.data.startDate,
      numberOfPhases: application.data.numberOfPhases,
      hasPhase: application.data.hasPhase,
      mentorThoughts: application.data.mentorThoughts,
      menteeThoughts: application.data.menteeThoughts,
      currentPhase: application.data.currentPhase,
      phases: application.data.phases,
    });
  };

  planTheProcess = async () => {
    const { id } = this.props.match.params;
    const mentorshipDto = {
      mentorId: id,
    };
    await axios.post(`http://localhost:8080/api/mentorships`, mentorshipDto);
    this.props.history.push('/');
  };

  startMentorship = async () => {
    const { id } = this.props.match.params;
    await axios
      .put(`http://localhost:8080/api/mentorships/${id}`)
      .then((res) => {
        this.setState({
          currentPhase: res.data.currentPhase,
          phases: res.data.phases,
          status: res.data.status,
        });
      });
  };

  getCurrentUser = async () => {
    await axios
      .get('http://localhost:8080/api/auth/user/me')
      .then((res) => {
        this.setState({ currentUser: res.data.username });
      })
      .then(() => {
        if (this.state.mentorUsername === this.state.currentUser) {
          this.setState({ isMentor: true });
        }
        if (this.state.menteeUsername === this.state.currentUser) {
          this.setState({ isMentee: true });
        }
      });
  };

  getPendingPhaseButton = (phase) => {
    let { isMentee, isMentor } = this.state;
    if (isMentee && phase.assessmentOfMentee !== null) {
      return (
        <Link className='col-md-2 mr-2 btn btn-outline-success btn-sm'>
          Pending Evaluation
        </Link>
      );
    } else if (isMentee && phase.assessmentOfMentee === null) {
      return (
        <Link
          to={`/completePhase/${phase.id}`}
          className='col-md-2 mr-2 btn btn-outline-success btn-sm'
        >
          Pending Evaluation
        </Link>
      );
    }

    if (isMentor && phase.assessmentOfMentor !== null) {
      return (
        <Link className='col-md-2 mr-2 btn btn-outline-success btn-sm'>
          Pending Evaluation
        </Link>
      );
    } else if (isMentor && phase.assessmentOfMentor === null) {
      return (
        <Link
          to={`/completePhase/${phase.id}`}
          className='col-md-2 mr-2 btn btn-outline-success btn-sm'
          mentorshipId={this.props.match.params.id}
        >
          Pending Evaluation
        </Link>
      );
    }
  };

  componentDidMount() {
    if (!this.props.security.roles[0]?.includes('USER')) {
      this.props.history.push('/');
    } else {
      const { id } = this.props.match.params;
      this.getMentorship(id).then(() => {
        this.getCurrentUser();
      });
    }
  }

  render() {
    return (
      <>
        <Header />
        <section
          class='section section-hero gradient-light--lean-right'
          style={{ paddingTop: '0px', paddingBottom: '1.4rem' }}
        >
          <div class='container'>
            <div class='row mt-5'>
              <div class='col-md-8'>
                <Link to='/'>
                  <small class='text-uppercase text-muted d-inline-block mb-3'>
                    <i class='fas fa-arrow-left'></i> Back
                  </small>
                </Link>

                <h1 class='mb-4'>Mentorship Details</h1>

                <p>If you want to work with this mentor, start the process.</p>
              </div>
            </div>
          </div>
        </section>

        <section
          class='section section-job-description gradient-light--upright'
          style={{ paddingTop: '2rem' }}
        >
          <div class='container'>
            <div class='row'>
              <div className='col-md-6'>
                <table class='table table-hover'>
                  <thead>
                    <tr></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope='row'>Mentor Name:</th>
                      <td>{this.state.mentorDisplayName}</td>
                    </tr>
                    <tr>
                      <th scope='row'>Mentee Name:</th>
                      <td>{this.state.menteeDisplayName}</td>
                    </tr>
                    <tr>
                      <th scope='row'>Start Date:</th>
                      <td>{this.state.startDate}</td>
                    </tr>
                    <tr>
                      <th scope='row'>Status:</th>
                      <td>{this.state.status}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className='container'>
            <div className='row'>
              <div className='col-md-10'>
                <div class='job-list__wrapper mb-4'>
                  <h3 class='h2 mb-4'>Phase List</h3>
                  {this.state.phases.length === 0 ? (
                    <div
                      class='alert alert-info text-center'
                      role='alert'
                      style={{ marginTop: 30 }}
                    >
                      <h3>There is no phase</h3>
                    </div>
                  ) : (
                    this.state.phases.map((phase, index) => {
                      return (
                        <>
                          <div className='row'>
                            <div className='col-md-12'>
                              <div key={index}>
                                <div class='card p-0 mb-3 border-0 shadow-sm shadow--on-hover'>
                                  <div class='card-body'>
                                    <span class='row justify-content-between align-items-center'>
                                      <span class='col-md-1 color--heading'>
                                        <span class='badge badge-circle background--success text-white'>
                                          {phase.phaseId}
                                        </span>{' '}
                                      </span>
                                      <span class='col-md-5  my-sm-0 color--text'>
                                        <i class='fas fa-book-reader'></i>{' '}
                                        {phase.name}
                                      </span>
                                      <span class='col-md-3 my-3 my-sm-0 color--text'>
                                        <i class='fas fa-calendar-alt'></i>{' '}
                                        {phase.endDate + ' ' + phase.endTime}
                                      </span>
                                      {phase.status === 'NOT_ACTIVE' && (
                                        <div className='col-md-2 mr-2 text-danger'>
                                          <i class='far fa-clock'></i> Not
                                          Active
                                        </div>
                                      )}
                                      {phase.status === 'ACTIVE' && (
                                        <Link
                                          to={`/completePhase/${phase.id}`}
                                          className='col-md-2 mr-2 btn btn-outline-success btn-sm'
                                        >
                                          Complete
                                        </Link>
                                      )}
                                      {phase.status === 'PENDING' &&
                                        this.getPendingPhaseButton(phase)}

                                      {phase.status === 'COMPLETED' && (
                                        <div className='col-md-2 mr-2 text-success'>
                                          <i class='far fa-check'></i> Completed
                                        </div>
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <div className='row'>
                                  {phase.assessmentOfMentor && (
                                    <div className='col-md-5'>
                                      {' '}
                                      <div class='swiper-slide testimony__card p-3'>
                                        <blockquote class='blockquote shadow'>
                                          <footer class='blockquote-footer d-flex align-items-center'>
                                            <div class='testimony__info d-inline-block'>
                                              <span class='info-name d-block'>
                                                Mentor
                                              </span>
                                              <span class='info-company d-block'>
                                                {this.state.mentorDisplayName}
                                              </span>
                                            </div>
                                          </footer>
                                          <p class='ml-3'>
                                            {phase.assessmentOfMentor}
                                          </p>
                                          <span class='rating text-warning d-block mt-1'>
                                            <i class='fas fa-star'></i>
                                            <i class='fas fa-star'></i>
                                            <i class='fas fa-star'></i>
                                            <i class='fas fa-star'></i>
                                            <i class='fas fa-star'></i>
                                          </span>
                                        </blockquote>
                                      </div>
                                    </div>
                                  )}
                                  {phase.assessmentOfMentee && (
                                    <div className='col-md-5'>
                                      {' '}
                                      <div class='swiper-slide testimony__card p-3'>
                                        <blockquote class='blockquote shadow'>
                                          <footer class='blockquote-footer d-flex align-items-center'>
                                            <div class='testimony__info d-inline-block'>
                                              <span class='info-name d-block'>
                                                Mentee
                                              </span>
                                              <span class='info-company d-block'>
                                                {this.state.menteeDisplayName}
                                              </span>
                                            </div>
                                          </footer>
                                          <p class='ml-3'>
                                            {phase.assessmentOfMentee}
                                          </p>
                                          <span class='rating text-warning d-block mt-1'>
                                            <i class='fas fa-star'></i>
                                            <i class='fas fa-star'></i>
                                            <i class='fas fa-star'></i>
                                            <i class='fas fa-star'></i>
                                            <i class='fas fa-star'></i>
                                          </span>
                                        </blockquote>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })
                  )}
                </div>
                <div className='container'>
                  <div className='row text-center'>
                    <div className='col'>
                      {this.state.hasPhase === false && (
                        <Link
                          to={`/planMentorship/${this.props.match.params.id}`}
                        >
                          <button
                            href='#0'
                            style={{ width: '20rem' }}
                            class='btn btn-success'
                          >
                            PLAN THE MENTORSHIP
                          </button>
                        </Link>
                      )}

                      {this.state.hasPhase === true &&
                        this.state.currentPhase == 0 && (
                          <button
                            href='#0'
                            style={{ width: '20rem' }}
                            class='btn btn-success'
                            onClick={this.startMentorship}
                          >
                            START THE MENTORSHIP
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

SelectMentor.propTypes = {
  security: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  security: state.security,
});

export default connect(mapStateToProps, {})(SelectMentor);
